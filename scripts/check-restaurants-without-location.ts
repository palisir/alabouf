import { createClient } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_CMA || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const LOCALE_EN = 'en-US';
const LOCALE_FR = 'fr';

function validateEnv() {
    if (!SPACE_ID) {
        throw new Error('Missing CONTENTFUL_SPACE_ID environment variable');
    }
    if (!MANAGEMENT_TOKEN) {
        throw new Error('Missing CONTENTFUL_CMA or CONTENTFUL_MANAGEMENT_TOKEN environment variable');
    }
}

async function checkRestaurantsWithoutLocation() {
    validateEnv();

    const client = createClient({
        accessToken: MANAGEMENT_TOKEN!,
    });

    console.log('🔄 Fetching space and environment...');
    const space = await client.getSpace(SPACE_ID!);
    const environment = await space.getEnvironment(ENVIRONMENT);

    console.log('🔄 Fetching all restaurants...');
    const restaurants = await environment.getEntries({
        content_type: 'restaurant',
        limit: 1000,
    });

    console.log(`📋 Found ${restaurants.items.length} restaurants\n`);

    const withoutLocation: Array<{ id: string; name: string }> = [];
    const withLocation: Array<{ id: string; name: string }> = [];

    for (const restaurant of restaurants.items) {
        const name = restaurant.fields.name?.[LOCALE_FR] || restaurant.fields.name?.[LOCALE_EN] || restaurant.sys.id;
        const locationEn = restaurant.fields.location?.[LOCALE_EN];
        const locationFr = restaurant.fields.location?.[LOCALE_FR];

        // Check if location exists in either locale
        if (!locationEn && !locationFr) {
            withoutLocation.push({
                id: restaurant.sys.id,
                name,
            });
            console.log(`❌ ${name} (ID: ${restaurant.sys.id}) - No location`);
        } else {
            withLocation.push({
                id: restaurant.sys.id,
                name,
            });
        }
    }

    console.log('\n📊 Summary:');
    console.log(`   Total restaurants: ${restaurants.items.length}`);
    console.log(`   With location: ${withLocation.length}`);
    console.log(`   Without location: ${withoutLocation.length}`);

    if (withoutLocation.length > 0) {
        console.log('\n📝 Restaurants without location:');
        withoutLocation.forEach(({ id, name }) => {
            console.log(`   - ${name} (ID: ${id})`);
        });
    } else {
        console.log('\n✅ All restaurants have a location!');
    }
}

checkRestaurantsWithoutLocation().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});
