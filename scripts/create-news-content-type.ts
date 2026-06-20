import { createClient, type ContentFields } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_CMA || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!SPACE_ID) throw new Error('Missing CONTENTFUL_SPACE_ID environment variable');
if (!MANAGEMENT_TOKEN) throw new Error('Missing CONTENTFUL_CMA or CONTENTFUL_MANAGEMENT_TOKEN environment variable');

// Canonical "news" schema. `restaurants` links a post to the restaurants it
// talks about, so their map markers can be surfaced from the post.
const FIELDS: ContentFields[] = [
    { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: true },
    { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false },
    { id: 'body', name: 'Body', type: 'RichText', required: true, localized: true },
    { id: 'publishedDate', name: 'Published date', type: 'Date', required: true, localized: false },
    {
        id: 'restaurants',
        name: 'Restaurants',
        type: 'Array',
        required: false,
        localized: false,
        items: { type: 'Link', linkType: 'Entry', validations: [{ linkContentType: ['restaurant'] }] },
    },
];

// Idempotent: creates the "news" content type when missing, otherwise rewrites
// its fields to match FIELDS. Safe to re-run whenever the schema evolves.
async function upsertNewsContentType() {
    const client = createClient({ accessToken: MANAGEMENT_TOKEN! });

    console.log('🔄 Fetching space and environment...');
    const space = await client.getSpace(SPACE_ID!);
    const environment = await space.getEnvironment(ENVIRONMENT);

    const existing = (await environment.getContentTypes()).items.find((ct) => ct.sys.id === 'news');

    let contentType;
    if (existing) {
        console.log('🔄 Updating existing "news" content type...');
        existing.fields = FIELDS;
        contentType = await existing.update();
    } else {
        console.log('🔄 Creating "news" content type...');
        contentType = await environment.createContentTypeWithId('news', {
            name: 'News',
            displayField: 'title',
            description: 'News / blog posts',
            fields: FIELDS,
        });
    }

    console.log('🔄 Publishing content type...');
    await contentType.publish();

    console.log('✅ Done — "news" content type up to date and published.');
}

upsertNewsContentType().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
