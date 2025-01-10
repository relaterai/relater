'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Input } from '@repo/design-system/components/ui/input';
import { Button } from '@repo/design-system/components/ui/button';
import { SearchIcon } from 'lucide-react';
import { useCallback } from 'react';

export const Search = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams);
      params.set(name, value);

      return params.toString();
    },
    [searchParams]
  );

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const search = formData.get('search') as string;

    router.push('?' + createQueryString('search', search));
  };

  return (
    <form onSubmit={handleSearch} className="flex w-full max-w-sm items-center space-x-2">
      <Input
        name="search"
        type="search"
        placeholder="Search notes..."
        className="h-9"
        defaultValue={searchParams.get('search') ?? ''}
      />
      <Button type="submit" size="sm" variant="ghost">
        <SearchIcon className="h-4 w-4" />
        <span className="sr-only">搜索</span>
      </Button>
    </form>
  );
};

export default Search;
