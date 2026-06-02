'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';
import type { Sport } from '@app-types/sport';

type HeroSearchProps = {
  sports: Sport[];
};

export default function HeroSearch({ sports }: HeroSearchProps) {
  const router = useRouter();
  const [keyword, setKeyword] = useState('');
  const [sportSlug, setSportSlug] = useState('');

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set('q', keyword.trim());
    if (sportSlug) params.set('sport', sportSlug);
    router.push(`${ROUTES.coaches}?${params.toString()}`);
  }

  return (
    <form className="home-hero__search" onSubmit={handleSearch} role="search">
      <input
        className="home-hero__search-input"
        type="text"
        placeholder="Bạn muốn học gì? VD: Pickleball, Yoga…"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        aria-label="Từ khoá tìm kiếm"
      />
      <select
        className="home-hero__search-select"
        value={sportSlug}
        onChange={(e) => setSportSlug(e.target.value)}
        aria-label="Lĩnh vực"
      >
        <option value="">Tất cả lĩnh vực</option>
        {sports.map((s) => (
          <option key={s.id} value={s.slug}>{s.name}</option>
        ))}
      </select>
      <Button type="submit" variant="primary">
        Tìm HLV
      </Button>
    </form>
  );
}
