import { createClient } from 'contentful-management';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_MANAGEMENT_TOKEN;
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const LOCALE = 'en-US';
const DRY_RUN = process.env.DRY_RUN === 'true';

function validateEnv() {
    if (!SPACE_ID) {
        throw new Error('Missing CONTENTFUL_SPACE_ID environment variable');
    }
    if (!MANAGEMENT_TOKEN) {
        throw new Error('Missing CONTENTFUL_MANAGEMENT_TOKEN environment variable');
    }
}

function validateTags(tags: unknown): tags is string[] {
    if (!Array.isArray(tags)) return false;
    return tags.every(tag => typeof tag === 'string' && tag.trim().length > 0);
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

async function updateRestaurantTags() {
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
        select: 'sys.id,fields.tags,fields.name',
    });

    console.log(`📋 Found ${restaurants.items.length} restaurants`);

    const toUpdate: Array<{ id: string; name: string; oldTags: string[]; newTags: string[] }> = [];
    let skippedCount = 0;

    for (const restaurant of restaurants.items) {
        const tags = restaurant.fields.tags?.[LOCALE];
        const name = restaurant.fields.name?.[LOCALE] || restaurant.sys.id;
        if (!tags || !Array.isArray(tags) || tags.length === 0) {
            console.log(`⏭️  Skipping ${name} (no tags)`);
            skippedCount++;
            continue;
        }

        if (!validateTags(tags)) {
            console.log(`⚠️  Warning: Invalid tags format for ${name}, skipping`);
            skippedCount++;
            continue;
        }

        const lowercaseTags = tags.map((tag: string) => tag.toLowerCase().trim());

        const hasChanged = tags.some((tag: string, index: number) => tag !== lowercaseTags[index]);

        if (!hasChanged) {
            skippedCount++;
            continue;
        }

        toUpdate.push({
            id: restaurant.sys.id,
            name,
            oldTags: tags,
            newTags: lowercaseTags,
        });
    }

    if (toUpdate.length === 0) {
        console.log('\n✅ No updates needed - all tags are already lowercase!');
        return;
    }

    console.log('\n📝 Changes to be made:');
    toUpdate.forEach(({ name, oldTags, newTags }) => {
        console.log(`   ${name}: [${oldTags.join(', ')}] → [${newTags.join(', ')}]`);
    });

    await confirmUpdate(toUpdate.length);

    let updatedCount = 0;
    let errorCount = 0;

    for (const { id, name, newTags } of toUpdate) {
        try {
            console.log(`✏️  Updating ${name}...`);

            if (!DRY_RUN) {
                const entry = await environment.getEntry(id);
                entry.fields.tags = { [LOCALE]: newTags };
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

updateRestaurantTags().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});

