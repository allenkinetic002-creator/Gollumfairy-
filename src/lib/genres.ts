/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface GenreItem {
  id: string;
  name: string;
  icon: string;
  description: string;
  tag: string;
}

/**
 * Top 10 primary genres for the Fairy Feed, featuring Artist and popular creative genres.
 */
export const TOP_10_GENRES: GenreItem[] = [
  {
    id: 'artist',
    name: 'Artist',
    icon: '🎨',
    description: 'Visual artists, illustrators, concept artists & painters',
    tag: '#artist',
  },
  {
    id: 'music',
    name: 'Music',
    icon: '🎵',
    description: 'Musicians, producers, beatmakers, vocalists & composers',
    tag: '#music',
  },
  {
    id: 'gaming',
    name: 'Gaming',
    icon: '🎮',
    description: 'Gamers, live streamers, game devs & clips',
    tag: '#gaming',
  },
  {
    id: 'tech',
    name: 'Tech & Code',
    icon: '💻',
    description: 'Developers, software engineers, AI creators & builders',
    tag: '#tech',
  },
  {
    id: 'fashion',
    name: 'Fashion & Style',
    icon: '👗',
    description: 'Fashion designers, styling, streetwear & aesthetics',
    tag: '#fashion',
  },
  {
    id: 'photography',
    name: 'Photography',
    icon: '📸',
    description: 'Photographers, visual storytellers, landscape & portraits',
    tag: '#photography',
  },
  {
    id: 'writing',
    name: 'Writing & Lore',
    icon: '✍️',
    description: 'Authors, poets, fiction writers & fantasy lore keepers',
    tag: '#writing',
  },
  {
    id: 'anime',
    name: 'Anime & Animation',
    icon: '⚡',
    description: 'Manga creators, 2D/3D animators & motion graphics',
    tag: '#anime',
  },
  {
    id: 'food',
    name: 'Food & Culinary',
    icon: '🍳',
    description: 'Chefs, recipes, bakeries, food styling & culinary art',
    tag: '#food',
  },
  {
    id: 'fitness',
    name: 'Fitness & Wellness',
    icon: '🏋️',
    description: 'Athletes, fitness trainers, health & mindful movement',
    tag: '#fitness',
  },
];

export function getGenreInfo(genreName?: string): GenreItem | undefined {
  if (!genreName) return undefined;
  const lower = genreName.toLowerCase().trim();
  return TOP_10_GENRES.find(
    (g) => g.name.toLowerCase() === lower || g.id === lower
  );
}
