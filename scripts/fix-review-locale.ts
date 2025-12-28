import { createClient } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_CMA || process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const LOCALE_EN = 'en-US';
const LOCALE_FR = 'fr';
const DRY_RUN = process.env.DRY_RUN === 'true';

function validateEnv() {
    if (!SPACE_ID) {
        throw new Error('Missing CONTENTFUL_SPACE_ID environment variable');
    }
    if (!MANAGEMENT_TOKEN) {
        throw new Error('Missing CONTENTFUL_CMA or CONTENTFUL_MANAGEMENT_TOKEN environment variable');
    }
}

async function confirmUpdate(count: number): Promise<boolean> {
    if (DRY_RUN) {
        console.log('\n🔍 DRY RUN MODE - No changes will be made');
        return true;
    }

    console.log(`\n⚠️  About to update ${count} restaurant(s).`);
    console.log('   Press Ctrl+C to cancel, or wait 5 seconds to continue...\n');

    await new Promise(resolve => setTimeout(resolve, 5000));
    return true;
}

async function fixReviewLocale() {
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

    console.log(`📋 Found ${restaurants.items.length} restaurants`);

    const toUpdate: Array<{ id: string; name: string }> = [];
    let skippedCount = 0;

    for (const restaurant of restaurants.items) {
        const name = restaurant.fields.name?.[LOCALE_FR] || restaurant.fields.name?.[LOCALE_EN] || restaurant.sys.id;
        const reviewEn = restaurant.fields.review?.[LOCALE_EN];
        const reviewFr = restaurant.fields.review?.[LOCALE_FR];

        // Skip if no English review (nothing to move)
        if (!reviewEn) {
            console.log(`⏭️  Skipping ${name} (no English review content)`);
            skippedCount++;
            continue;
        }

        // Skip if French review already exists (don't overwrite)
        if (reviewFr) {
            console.log(`⏭️  Skipping ${name} (French review already exists)`);
            skippedCount++;
            continue;
        }

        toUpdate.push({
            id: restaurant.sys.id,
            name,
        });
    }

    if (toUpdate.length === 0) {
        console.log('\n✅ No updates needed - all reviews are in the correct locale!');
        return;
    }

    console.log('\n📝 Changes to be made:');
    toUpdate.forEach(({ name }) => {
        console.log(`   ${name}: Move review from en-US → fr`);
    });

    await confirmUpdate(toUpdate.length);

    let updatedCount = 0;
    let errorCount = 0;

    for (const { id, name } of toUpdate) {
        try {
            console.log(`✏️  Updating ${name}...`);

            if (!DRY_RUN) {
                const entry = await environment.getEntry(id);
                const reviewContent = entry.fields.review?.[LOCALE_EN];
                
                // Move content from en-US to fr
                entry.fields.review = {
                    [LOCALE_FR]: reviewContent,
                };
                
                const updatedEntry = await entry.update();
                await updatedEntry.publish();
            }

            updatedCount++;
        } catch (error) {
            console.error(`❌ Failed to update ${name}:`, error instanceof Error ? error.message : error);
            errorCount++;
        }
    }

    console.log('\n✅ Done!');
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${restaurants.items.length}`);

    if (errorCount > 0) {
        console.log('\n⚠️  Some entries failed to update. Please check the errors above.');
        process.exit(1);
    }
}

fixReviewLocale().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});

