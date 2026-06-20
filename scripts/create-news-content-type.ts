import { createClient } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_CMA || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';

if (!SPACE_ID) throw new Error('Missing CONTENTFUL_SPACE_ID environment variable');
if (!MANAGEMENT_TOKEN) throw new Error('Missing CONTENTFUL_CMA or CONTENTFUL_MANAGEMENT_TOKEN environment variable');

async function createNewsContentType() {
    const client = createClient({ accessToken: MANAGEMENT_TOKEN! });

    console.log('🔄 Fetching space and environment...');
    const space = await client.getSpace(SPACE_ID!);
    const environment = await space.getEnvironment(ENVIRONMENT);

    console.log('🔄 Creating "news" content type...');
    const contentType = await environment.createContentTypeWithId('news', {
        name: 'News',
        displayField: 'title',
        description: 'News / blog posts',
        fields: [
            { id: 'title', name: 'Title', type: 'Symbol', required: true, localized: true },
            { id: 'slug', name: 'Slug', type: 'Symbol', required: true, localized: false },
            { id: 'body', name: 'Body', type: 'RichText', required: true, localized: true },
            { id: 'publishedDate', name: 'Published date', type: 'Date', required: true, localized: false },
        ],
    });

    console.log('🔄 Publishing content type...');
    await contentType.publish();

    console.log('✅ Done — "news" content type created and published.');
}

createNewsContentType().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
