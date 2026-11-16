// Everything the site says about you lives in this file.

/** Names of the small line icons in src/components/Icon.astro. */
export type IconName =
  | 'tap'
  | 'chart'
  | 'bell'
  | 'video'
  | 'scan'
  | 'plate'
  | 'coin'
  | 'versus'
  | 'lock'
  | 'offline'
  | 'forecast'
  | 'zoom'
  | 'layers'
  | 'shield'
  | 'wallet'
  | 'updown'
  | 'clock'
  | 'train'
  | 'door'
  | 'stamp';

/** Names of the challenge diagrams in src/components/Graphic.astro. */
export type GraphicName =
  | 'rls'
  | 'queue'
  | 'forecast'
  | 'crop'
  | 'plates'
  | 'votes'
  | 'wallet'
  | 'odds'
  | 'cron'
  | 'pixels'
  | 'synth'
  | 'nobuild';

interface Step {
  icon: IconName;
  title: string;
  /** Keep this to one short sentence. */
  text: string;
}

interface Challenge {
  /** The diagram drawn above the text. */
  art: GraphicName;
  title: string;
  /** Keep this to one short sentence. */
  text: string;
}

export interface Project {
  /** Anchor id of the project on the page. */
  slug: string;
  /** Colour of the project's Challenges card. */
  accent: string;
  title: string;
  /** One line for the carousel under the hero. */
  summary: string;
  /** Longer text pinned beside the cards in the Work section. */
  description: string;
  tags: string[];
  year: string;
  /** What kind of thing it is, e.g. "Progressive web app". */
  kind: string;
  role: string;
  links: { label: string; href: string }[];
  /**
   * The cover art. 'subu' and 'dotesy' are drawn in code; 'image' uses a file from /public.
   */
  cover: { type: 'subu' } | { type: 'dotesy' } | { type: 'image'; src: string; pixelated?: boolean };
  story: {
    /** One sentence, shown large. */
    problem: string;
    /** The drawing beside the problem: see src/components/Illustration.astro. */
    problemArt: 'calendar' | 'plate' | 'coins' | 'wander';
    /** Exactly three steps. */
    solution: Step[];
    /** Exactly three challenges. */
    challenges: Challenge[];
    stack: { group: string; items: string }[];
  };
}

export const site = {
  name: { first: 'Khant Nyi', last: 'Thu' },
  role: 'Full-stack software engineer',
  location: 'Bangkok, Thailand',
  email: 'khantnyithu@gmail.com',

  // Your photo in the hero (file lives in /public).
  portrait: '/portrait.jpg',

  // One line under your name in the hero.
  tagline: 'I design and build reliable software, from the database to the last pixel.',

  // The large statement in the About section. Two or three sentences reads best.
  about:
    'I am a full-stack engineer who likes building things and seeing them come to life. I care about systems that stay fast as they grow, interfaces that feel intuitive, and architecture that scales. These are a few things I have built on my own time.',

  facts: [
    { label: 'Currently', value: 'Building side projects and open to new work' },
    { label: 'Stack', value: 'TypeScript, Next.js, React, Supabase and PostgreSQL, Python' },
    { label: 'Based in', value: 'Bangkok, Thailand' },
  ],

  projects: [
    {
      slug: 'athone-sayate',
      accent: '#e8744f',
      title: 'Athone Sayate',
      summary: 'An expense tracker you can install, built to log spending in two taps.',
      description:
        'Athone Sayate ("Expenses" in Burmese) is a personal expense tracker built as an installable progressive web app. Log spending in a couple of taps, see where the month is heading before it gets away from you, and keep recurring bills from going unnoticed.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'PWA'],
      year: '2026',
      kind: 'Progressive web app',
      role: 'Design and development',
      links: [{ label: 'Live site', href: 'https://athonesayate.vercel.app/' }],
      cover: { type: 'subu' },
      story: {
        problem: 'Most expense trackers ask for too many taps, so you stop logging.',
        problemArt: 'calendar',
        solution: [
          { icon: 'tap', title: 'Log in two taps', text: 'Your most-used categories come first.' },
          { icon: 'chart', title: 'See the month ahead', text: 'A forecast and a safe-to-spend figure for each day.' },
          { icon: 'bell', title: 'Never miss a bill', text: 'A push reminder the night before it is due.' },
        ],
        challenges: [
          {
            art: 'rls',
            title: 'Security without an API',
            text: 'The browser talks to the database directly, so row-level rules guard every table.',
          },
          {
            art: 'queue',
            title: 'Working offline',
            text: 'Writes queue on the device and replay in order when the signal returns.',
          },
          {
            art: 'forecast',
            title: 'An explainable forecast',
            text: 'A weighted-rate model where every number traces back to real transactions.',
          },
        ],
        stack: [
          { group: 'Frontend', items: 'Next.js 15, React 19, TypeScript, Tailwind CSS, Recharts' },
          { group: 'Backend', items: 'Supabase (PostgreSQL, Auth, row-level security)' },
          { group: 'Offline and push', items: 'Serwist service worker, Web Push' },
          { group: 'Hosting', items: 'Vercel, with Vercel Cron for bill reminders' },
        ],
      },
    },
    {
      slug: 'saferide',
      accent: '#5b9bff',
      title: 'SafeRide',
      summary: 'Computer vision that spots riders without helmets and reads their plates.',
      description:
        'SafeRide is a senior-project computer vision web app for detecting motorcycle helmet violations and capturing license plate evidence.',
      tags: ['Next.js', 'FastAPI', 'YOLO', 'EasyOCR'],
      year: '2026',
      kind: 'Computer vision web app',
      role: 'Senior project',
      links: [{ label: 'Source code', href: 'https://github.com/KhantNyi/SafeRide' }],
      cover: { type: 'image', src: '/projects/saferide.webp' },
      story: {
        problem: 'Helmet rules are enforced by eye, one moving plate at a time.',
        problemArt: 'plate',
        solution: [
          { icon: 'video', title: 'Feed it video', text: 'Upload a clip or connect a live camera.' },
          {
            icon: 'scan',
            title: 'Detect the violation',
            text: 'Three models find the motorcycle, the helmet and the plate.',
          },
          { icon: 'plate', title: 'Keep the evidence', text: 'The plate is read and saved for a person to review.' },
        ],
        challenges: [
          { art: 'crop', title: 'Riders too small', text: 'A second helmet check runs on a close crop of each rider.' },
          {
            art: 'plates',
            title: 'Plates that blur',
            text: 'Plate crops are collected for six seconds and the best three are read.',
          },
          {
            art: 'votes',
            title: 'No false accusations',
            text: 'A rider needs several votes and plate sightings before anything counts.',
          },
        ],
        stack: [
          { group: 'Frontend', items: 'Next.js, TypeScript' },
          { group: 'Backend', items: 'FastAPI, SQLite' },
          { group: 'Vision', items: 'Ultralytics YOLO (YOLO11 and YOLOv8 models), EasyOCR, PyTorch' },
          { group: 'Runs on', items: 'CUDA, Apple Silicon or CPU, selected automatically' },
        ],
      },
    },
    {
      slug: 'dotesy',
      accent: '#2fd492',
      title: 'Dotesy',
      summary: 'A play-money prediction market for esports, with its own odds engine.',
      description:
        'An esports prediction market web app with fantasy currency and a custom betting engine. Users can place bets on the outcome of esports matches, and the app uses a custom algorithm to calculate odds and payouts.',
      tags: ['Next.js', 'TypeScript', 'Supabase', 'Web Push'],
      year: '2026',
      kind: 'Progressive web app',
      role: 'Design and development',
      links: [{ label: 'Live site', href: 'https://dotesy.vercel.app/' }],
      cover: { type: 'dotesy' },
      story: {
        problem: 'Calling a match is more fun with stakes, but real money is a bad idea.',
        problemArt: 'coins',
        solution: [
          { icon: 'coin', title: 'Bet play money', text: 'Stake imaginary Cash on five games, singly or as parlays.' },
          { icon: 'versus', title: 'Challenge friends', text: 'Head-to-head battles and a shared leaderboard.' },
          { icon: 'bell', title: 'Settle automatically', text: 'Results arrive as a push notification.' },
        ],
        challenges: [
          {
            art: 'wallet',
            title: 'A wallet the browser cannot touch',
            text: 'Every balance change runs inside a locked database function.',
          },
          {
            art: 'odds',
            title: 'Odds that move',
            text: 'The server reprices each bet and asks you to confirm any change.',
          },
          {
            art: 'cron',
            title: 'Settling on a free tier',
            text: 'A scheduled job settles everything about every ten minutes.',
          },
        ],
        stack: [
          { group: 'Frontend', items: 'Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui' },
          { group: 'Backend', items: 'Supabase (PostgreSQL, Auth, Realtime), Postgres RPCs for the wallet' },
          { group: 'Automation', items: 'GitHub Actions and Vercel Cron for settlement, Web Push' },
          { group: 'Data', items: 'PandaScore, football-data.org' },
        ],
      },
    },
    {
      slug: 'tabi',
      accent: '#f29bb7',
      title: 'Tabi',
      summary: 'A slow, no-fail pixel-art walk through Tokyo, drawn and scored entirely in code.',
      description:
        'Tabi ("journey" in Japanese) is a top-down pixel-art game about wandering Tokyo with nothing to win or lose. Ride the train between districts, step into shops and temples, collect stamps and pet the cats.',
      tags: ['JavaScript', 'Canvas', 'Web Audio', 'No dependencies'],
      year: '2026',
      kind: 'Browser game',
      role: 'Design and development',
      links: [
        { label: 'Play it', href: 'https://play-tabi.vercel.app/' },
        { label: 'Source code', href: 'https://github.com/KhantNyi/tabi' },
      ],
      cover: { type: 'image', src: '/projects/tabi.webp', pixelated: true },
      story: {
        problem: 'Most games hurry you along. I wanted a city you could simply wander.',
        problemArt: 'wander',
        solution: [
          { icon: 'train', title: 'Ride one train line', text: 'Eight Tokyo districts, from Shibuya to Tokyo Tower.' },
          { icon: 'door', title: 'Step inside', text: 'Fifteen shops, temples and cafés you can enter.' },
          { icon: 'stamp', title: 'Collect as you go', text: 'Stamps, capsule figures, cats and five minigames.' },
        ],
        challenges: [
          {
            art: 'pixels',
            title: 'Not one image file',
            text: 'Every sprite, building and letter is drawn in code on a canvas.',
          },
          {
            art: 'synth',
            title: 'Music from nothing',
            text: 'The chiptune soundtrack and effects are synthesized live in the browser.',
          },
          {
            art: 'nobuild',
            title: 'No build step',
            text: 'Plain script tags, so the game runs straight from the file.',
          },
        ],
        stack: [
          { group: 'Language', items: 'Plain JavaScript and HTML, no libraries' },
          { group: 'Rendering', items: 'Canvas 2D at double pixel density, with a hand-made bitmap font' },
          { group: 'Audio', items: 'Web Audio API' },
          { group: 'Saves and hosting', items: 'localStorage, Vercel' },
        ],
      },
    },
  ] as Project[],

  socials: [
    { label: 'GitHub', href: 'https://github.com/KhantNyi' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
  ],
};
