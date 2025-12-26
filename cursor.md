# alabouf Project Documentation

## Project Overview

**alabouf** is a restaurant discovery web application that displays favorite restaurants on an interactive map. The tagline is: "On a testé, on a aimé, on partage. Nos restos favoris sur une carte."

The target audience is anyone looking for local food recommendations.

## Tech Stack

- **Next.js** ([Next.js documentation](https://nextjs.org/docs)) - React framework with App Router
- **TypeScript** - Type safety
- **React** - UI library
- **Tailwind CSS** ([Tailwind CSS documentation](https://tailwindcss.com/docs)) - Styling
- **Bun** - Package manager and runtime
- **Contentful** ([Contentful headless CMS documentation](https://www.contentful.com/developers/docs/)) - Content management and delivery
- **Mapbox GL JS** ([Mapbox GL JS documentation](https://docs.mapbox.com/mapbox-gl-js/)) - Interactive maps
- **Formspree** ([Formspree documentation](https://formspree.io/docs)) - Contact form handling
- **Umami** ([Umami documentation](https://umami.is/docs)) - Web analytics (optional)

## Environment Variables

Required environment variables (create `.env.local` in the root directory):

### Contentful (Required)
- `CONTENTFUL_SPACE_ID` - Contentful space identifier
- `CONTENTFUL_ACCESS_TOKEN` - Contentful Content Delivery API access token (used by the app)
- `CONTENTFUL_MANAGEMENT_TOKEN` - Contentful Management API access token (used by maintenance scripts)
- `CONTENTFUL_ENVIRONMENT` - Contentful environment (optional, defaults to `'master'`)

### Mapbox (Required)
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` - Mapbox access token for map rendering

### Formspree (Required)
- `NEXT_PUBLIC_FORMSPREE_FORM_ID` - Formspree form ID for contact form submissions

### Umami (Optional)
- `NEXT_PUBLIC_UMAMI_WEBSITE_ID` - Umami website ID for analytics tracking (if not provided, analytics are disabled)

### Scripts
- `DRY_RUN` - Set to `'true'` to run maintenance scripts in dry-run mode (no changes made)

## Contentful Content Model

The project uses two content types in Contentful:

### 1. Restaurant (`restaurant`)
- `name` (Symbol, required) - Restaurant name
- `slug` (Symbol, required) - URL-friendly identifier
- `review` (RichText, optional) - Restaurant review/description
- `location` (Location, optional) - Geographic coordinates (lat/lon)
- `picture` (Array of Assets, optional) - Restaurant images
- `tags` (Array of Symbols, optional) - Tags for categorization (must be lowercase for case-sensitive filtering)
- `instagram` (Symbol, optional) - Instagram handle
- `favorite` (Boolean, optional) - Marks favorite restaurants (displayed in red on map)

**Important**: Tags must be lowercase. The case-sensitive filtering algorithm breaks if tags have mixed case. Use the `downcase-tags` script to fix existing entries.

### 2. Static Page (`staticPage`)
- `title` (Symbol, required) - Page title
- `slug` (Symbol, required) - URL-friendly identifier
- `body` (RichText, required) - Page content

### Content Locale
- The app uses `'fr'` (French) as the primary locale for content delivery
- Maintenance scripts use `'en-US'` locale

## Development Workflow

### Getting Started

1. Install dependencies:
```bash
bun install
```

2. Create `.env.local` with all required environment variables (see Environment Variables section)

3. Start the development server:
```bash
bun run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

### Adding Content

1. Log in to the Contentful dashboard
2. Create a new entry for the appropriate content type (Restaurant or Static Page)
3. Fill in all mandatory fields
4. Submit/publish the entry
5. Content appears on the site after Contentful's CDN cache updates (usually within a few minutes)

**Note**: Entries can be kept as drafts if content is incomplete. Drafts are not displayed on the site.

### Git Workflow

- Solo developer workflow
- Work is done on the `dev` branch
- Merging `dev` into `main` automatically triggers a Vercel deployment

### Code Quality

- ESLint is configured with Next.js rules
- Husky pre-commit hooks run lint-staged to auto-fix linting issues
- TypeScript provides type safety

## Deployment

The project is hosted on **Vercel** ([Vercel documentation](https://vercel.com/docs)) - the standard hosting platform for Next.js applications.

- Automatic deployments are triggered on merge to `main` branch
- Environment variables must be configured in Vercel dashboard
- Production builds use `bun run build`

## Available Scripts

- `bun run dev` - Start development server
- `bun run build` - Build production bundle
- `bun run start` - Start production server
- `bun run lint` - Run ESLint
- `bun run downcase-tags` - Maintenance script to convert all restaurant tags to lowercase (fixes case-sensitivity issues)
- `bun run downcase-tags:dry` - Run downcase-tags script in dry-run mode (preview changes without applying them)

## Project Structure

```
app/
  [slug]/              # Dynamic routes for static pages
  components/          # React components
    Map.tsx            # Mapbox map component
    PanelContext.tsx   # Context for side panel state
    PanelToggleButton.tsx
    PanelWithContent.tsx
    RestaurantList.tsx
    RestaurantListItem.tsx
  contact/             # Contact page
  restaurants/         # Restaurant pages
    [slug]/            # Individual restaurant detail pages
  layout.tsx          # Root layout (loads restaurants, sets up map)
  page.tsx             # Home page

lib/
  contentful/          # Contentful integration
    client.ts          # Contentful client configuration
    restaurants.ts     # Restaurant data fetching functions
    static-pages.ts    # Static page data fetching functions
    types.ts           # TypeScript types for Contentful entries

scripts/
  downcase-restaurant-tags.ts  # Maintenance script for tag normalization
```

## Key Implementation Details

### Map Component
- Uses Mapbox GL JS for interactive map rendering
- Displays restaurants as colored circles (red for favorites, blue for regular)
- Clicking a marker navigates to the restaurant detail page
- Map automatically centers on selected restaurant when viewing detail pages
- Custom Mapbox style: `mapbox://styles/alabouf/cmhfp7e88001g01qib2sbedku`

### Panel System
- Side panel system for displaying content over the map
- Uses React Context (`PanelContext`) for state management
- Panel can be toggled open/closed
- Clicking map background closes the panel

### Restaurant Filtering
- Tags are used for case-sensitive filtering via Contentful's `fields.tags[in]` query parameter
- This is why tags must be lowercase - mixed case breaks the filtering algorithm

### Analytics
- Umami analytics is conditionally loaded if `NEXT_PUBLIC_UMAMI_WEBSITE_ID` is set
- Analytics script loads with `afterInteractive` strategy

## Future Development

- **UI Redesign**: Current site needs visual improvements, mobile-first approach planned as a separate effort
- Structure and core functionality are complete

## External Service References

- [Contentful Headless CMS](https://www.contentful.com/developers/docs/)
- [Mapbox GL JS](https://docs.mapbox.com/mapbox-gl-js/)
- [Formspree](https://formspree.io/docs)
- [Umami Analytics](https://umami.is/docs)
- [Vercel](https://vercel.com/docs)
- [Next.js](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)

