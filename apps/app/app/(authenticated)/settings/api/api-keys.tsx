"use client";

import { useState, useEffect } from "react";
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";
import { Label } from "@repo/design-system/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/design-system/components/ui/card";
import { toast } from "sonner";
import { CopyIcon, PlusIcon, TrashIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@repo/design-system/components/ui/dialog";

interface Token {
  id: string;
  name: string;
  partialKey: string;
  lastUsed: string;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    name: string;
    image: string;
    isMachine: boolean;
  };
}

export default function ApiKeys() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [showNewKeyDialog, setShowNewKeyDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [tokenToDelete, setTokenToDelete] = useState<Token | null>(null);
  const [newApiKey, setNewApiKey] = useState("");

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      const response = await fetch("/api/tokens");
      if (!response.ok) {
        throw new Error("Failed to fetch tokens");
      }
      const data = await response.json();
      setTokens(data);
    } catch (error) {
      toast.error("Error fetching tokens");
    }
  };

  const createNewApiKey = async () => {
    if (!newKeyName) {
      toast.error("Please enter an API key name");
      return;
    }

    setIsCreating(true);
    try {
      const response = await fetch("/api/tokens", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: newKeyName }),
      });

      if (!response.ok) {
        throw new Error("Failed to create token");
      }

      const { token } = await response.json();
      await fetchTokens();
      setNewKeyName("");
      setNewApiKey(token);
      setShowNewKeyDialog(true);
    } catch (error) {
      toast.error("Failed to create API key");
    } finally {
      setIsCreating(false);
    }
  };

  const copyNewApiKey = () => {
    navigator.clipboard.writeText(newApiKey);
    toast.success("API key copied to clipboard");
  };

  const confirmDelete = (token: Token) => {
    setTokenToDelete(token);
    setShowDeleteDialog(true);
  };

  const deleteApiKey = async () => {
    if (!tokenToDelete) return;

    try {
      const response = await fetch(`/api/tokens/${tokenToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete token");
      }

      await fetchTokens();
      toast.success("API key deleted");
      setShowDeleteDialog(false);
      setTokenToDelete(null);
    } catch (error) {
      toast.error("Failed to delete API key");
    }
  };

  const copyApiKey = (partialKey: string) => {
    navigator.clipboard.writeText(partialKey);
    toast.success("API key copied to clipboard");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium">API Keys</h2>
        <p className="text-sm text-muted-foreground">
          Manage your API keys to access the Relater API.
        </p>
      </div>

      <Dialog open={showNewKeyDialog} onOpenChange={setShowNewKeyDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New API Key Created</DialogTitle>
            <DialogDescription>
              For security reasons, this API key will only be shown once. Please copy it and store it securely.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-muted rounded-lg break-all">
              {newApiKey}
            </div>
            <Button onClick={copyNewApiKey} className="w-full">
              <CopyIcon className="mr-2 h-4 w-4" />
              Copy API Key
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete API Key</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete API Key "{tokenToDelete?.name}"? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={deleteApiKey}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Card>
        <CardHeader>
          <CardTitle>Create New API Key</CardTitle>
          <CardDescription>
            Create a new API key for your application.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="keyName">Key Name</Label>
              <Input
                id="keyName"
                placeholder="Enter API key name"
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
              />
            </div>
            <Button
              className="self-end"
              onClick={createNewApiKey}
              disabled={isCreating}
            >
              <PlusIcon className="mr-2 h-4 w-4" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Existing API Keys</h3>
        {tokens.length === 0 ? (
          <p className="text-sm text-muted-foreground">No API keys have been created yet.</p>
        ) : (
          tokens.map((token) => (
            <Card key={token.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{token.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Created on {new Date(token.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last used: {token.lastUsed ? new Date(token.lastUsed).toLocaleDateString() : 'Never used'}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => confirmDelete(token)}
                    >
                      <TrashIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
