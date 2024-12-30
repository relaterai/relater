import type { User } from '@repo/database';
// @ts-ignore
import type { TaskContext } from 'vitest';
import { HttpClient } from '../utils/http';

interface Resources {
  user: Pick<User, 'id'>;
  apiKey: {
    token: string;
  };
}

export class IntegrationHarness {
  private readonly ctx?: TaskContext;
  private env: Record<string, string>;
  public resources: Resources;
  public baseUrl: string;
  public http: HttpClient;

  constructor(ctx?: TaskContext) {
    this.env = {
      E2E_BASE_URL: process.env.E2E_BASE_URL ?? 'http://localhost:3000',
      E2E_TOKEN: process.env.E2E_TOKEN ?? 'Z8Rse117sTn0h1zV8uoYuwg0',
      E2E_USER_ID: process.env.E2E_USER_ID ?? 'cm5ant50d0000180q277dpbd0',
    };
    this.ctx = ctx;
    this.baseUrl = this.env.E2E_BASE_URL;
    this.http = new HttpClient({
      baseUrl: `${this.baseUrl}/api`,
      headers: {
        Authorization: `Bearer ${this.env.E2E_TOKEN}`,
      },
    });
    this.resources = {
      user: { id: '' },
      apiKey: { token: '' },
    };
  }

  async init() {
    const user = {
      id: this.env.E2E_USER_ID,
    };

    const apiKey = {
      token: this.env.E2E_TOKEN,
    };

    this.resources = {
      user,
      apiKey,
    };

    return { ...this.resources, http: this.http };
  }

  // Delete Snapshot
  public async deleteSnapshot(id: string) {
    await this.http.delete({
      path: `/snapshots/${id}`,
    });
  }

  // Delete tag
  public async deleteTag(id: string) {
    await this.http.delete({
      path: `/tags/${id}`,
    });
  }
}
