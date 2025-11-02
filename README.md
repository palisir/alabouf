# alabouf

A restaurant discovery web application that displays favorite restaurants on an interactive map. "On a testé, on a aimé, on partage. Nos restos favoris sur une carte."

Built with Next.js, TypeScript, Mapbox GL, and Contentful CMS.

## Getting Started

### Prerequisites

- Bun
- A Contentful account and space
- A Mapbox account and access token

### Installation

1. Clone the repository and install dependencies:

```bash
bun install
```

2. Create `.env.local` from `.env.sample` in the root directory and fill all the env variables

```bash
cp .env.local .env.sample
```

3. Run the development server:

```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Available Scripts

- `bun run dev` - Start the development server
- `bun run build` - Build the production bundle
- `bun run start` - Start the production server
- `bun run lint` - Run ESLint

## Todo

- [ ] Add mobile responsiveness
- [ ] Add search/filter functionality for restaurants
- [ ] Add social sharing functionality
- [ ] Add i18n
