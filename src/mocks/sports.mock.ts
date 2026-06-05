import type { Sport } from '@app-types/sport';
import { registerMock } from '@lib/mockRegistry';

export const sportsMock: Sport[] = [
  // ── Thể thao ─────────────────────────────────────────
  { id: 's1',  slug: 'pickleball',  name: 'Pickleball',     category: 'sport', image: '/images/Pickleball.webp',   coachCount: 24 },
  { id: 's2',  slug: 'yoga',        name: 'Yoga',           category: 'sport', image: '/images/yoga-3.webp',      coachCount: 38 },
  { id: 's3',  slug: 'gym-fitness', name: 'Gym & Fitness',  category: 'sport', image: '/images/running-2.webp',   coachCount: 56 },
  { id: 's4',  slug: 'tennis',      name: 'Tennis',         category: 'sport', image: '/images/tennis-2.webp',    coachCount: 19 },
  { id: 's5',  slug: 'golf',        name: 'Golf',           category: 'sport', image: '/images/golf-3.webp',      coachCount: 12 },
  { id: 's6',  slug: 'football',    name: 'Football',       category: 'sport', image: '/images/Football.webp',    coachCount: 22 },
  { id: 's7',  slug: 'basketball',  name: 'Basketball',     category: 'sport', image: '/images/Basketball.webp',  coachCount: 17 },
  { id: 's8',  slug: 'boxing',      name: 'Boxing',         category: 'sport', image: '/images/Boxing.webp',      coachCount: 14 },
  { id: 's9',  slug: 'pilates',     name: 'Pilates',        category: 'sport', image: '/images/swiming-4.webp',   coachCount: 21 },

  // ── Tech ─────────────────────────────────────────────
  { id: 't1',  slug: 'coding',      name: 'Coding',         category: 'tech',  image: '/images/Coding.webp',     coachCount: 32 },
  { id: 't2',  slug: 'ai',          name: 'AI / ML',        category: 'tech',  image: '/images/AI.webp',         coachCount: 18 },
  { id: 't3',  slug: 'devops',      name: 'DevOps',         category: 'tech',  image: '/images/Devops.webp',     coachCount: 11 },
  { id: 't4',  slug: 'data',        name: 'Data',           category: 'tech',  image: '/images/Data.webp',       coachCount: 15 },
  { id: 't5',  slug: 'mobile',      name: 'Mobile Dev',     category: 'tech',  image: '/images/Mobile.webp',     coachCount: 13 },
  { id: 't6',  slug: 'cyber',       name: 'Cybersecurity',  category: 'tech',  image: '/images/Cyber.webp',      coachCount: 9 },
  { id: 't7',  slug: 'blockchain',  name: 'Blockchain',     category: 'tech',  image: '/images/Blockchain.webp', coachCount: 7 },
  { id: 't8',  slug: 'ux',          name: 'UX / UI Design', category: 'tech',  image: '/images/Ux.webp',         coachCount: 16 },
];

registerMock('GET /sports', () => sportsMock);

registerMock('GET /sports/:slug', ({ pathParams }) => {
  const found = sportsMock.find((s) => s.slug === pathParams.slug);
  if (!found) throw new Error(`Sport not found: ${pathParams.slug}`);
  return found;
});
