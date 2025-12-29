/**
 * Translate Restaurant Script
 * 
 * Translates restaurant review (RichText) field from French to English
 * using the 1min.ai Content Translator API.
 * 
 * Required Environment Variables:
 * - CONTENTFUL_SPACE_ID: Contentful space ID
 * - CONTENTFUL_CMA: Contentful Management API token
 * - 1MINAI_API_KEY: 1min.ai API key
 * - CONTENTFUL_ENVIRONMENT: (optional) defaults to 'master'
 * 
 * Usage:
 *   bun run translate-restaurants                    # Translate reviews only
 *   bun run translate-restaurants --include-tags    # Also translate tags
 *   bun run translate-restaurants:dry               # Dry run mode (no changes)
 * 
 * The script will:
 * 1. Fetch all restaurants with French content
 * 2. For each restaurant, display the original French text and the translated English
 * 3. Prompt for confirmation before applying changes
 * 4. Write translations to the en-US locale in Contentful
 */

import { createClient } from 'contentful-management';
import * as readline from 'readline';

const SPACE_ID = process.env.CONTENTFUL_SPACE_ID;
const MANAGEMENT_TOKEN = process.env.CONTENTFUL_CMA;
const MINAI_API_KEY = process.env['1MINAI_API_KEY'];
const ENVIRONMENT = process.env.CONTENTFUL_ENVIRONMENT || 'master';
const LOCALE_FR = 'fr';
const LOCALE_EN = 'en-US';
const DRY_RUN = process.argv.includes('--dry-run') || process.env.DRY_RUN === 'true';
const INCLUDE_TAGS = process.argv.includes('--include-tags');

interface RichTextNode {
    nodeType: string;
    data?: Record<string, unknown>;
    content?: RichTextNode[];
    value?: string;
    marks?: Array<{ type: string }>;
}

interface RichTextDocument {
    nodeType: 'document';
    data: Record<string, unknown>;
    content: RichTextNode[];
}

function validateEnv() {
    if (!SPACE_ID) {
        throw new Error('Missing CONTENTFUL_SPACE_ID environment variable');
    }
    if (!MANAGEMENT_TOKEN) {
        throw new Error('Missing CONTENTFUL_CMA environment variable');
    }
    if (!MINAI_API_KEY) {
        throw new Error('Missing 1MINAI_API_KEY environment variable');
    }
}

async function translate(text: string, fromLang: string, toLang: string): Promise<string> {
    const response = await fetch('https://api.1min.ai/api/features', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'API-KEY': MINAI_API_KEY!,
        },
        body: JSON.stringify({
            type: 'CONTENT_TRANSLATOR',
            model: 'deepseek-chat',
            conversationId: 'CONTENT_TRANSLATOR',
            promptObject: {
                originalLanguage: fromLang,
                targetLanguage: toLang,
                tone: 'friendly',
                prompt: text,
            },
        }),
    });

    if (!response.ok) {
        throw new Error(`Translation API failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    
    // Extract translated text from the response
    const result = data.aiRecord?.aiRecordDetail?.resultObject;
    
    if (result) {
        // Handle different response formats
        if (typeof result === 'string') {
            return result;
        }
        if (Array.isArray(result) && result.length > 0) {
            return String(result[0]);
        }
        if (typeof result === 'object' && result.text) {
            return String(result.text);
        }
        // Fallback: stringify and log for debugging
        console.error('Unexpected resultObject format:', JSON.stringify(result, null, 2));
        throw new Error(`Unexpected translation result format: ${typeof result}`);
    }
    
    console.error('Full API response:', JSON.stringify(data, null, 2));
    throw new Error('Invalid response format from translation API');
}

function extractTextFromRichText(document: RichTextDocument): string[] {
    const texts: string[] = [];
    
    function traverse(node: RichTextNode) {
        if (node.nodeType === 'text' && node.value) {
            texts.push(node.value);
        }
        if (node.content) {
            node.content.forEach(traverse);
        }
    }
    
    traverse(document);
    return texts;
}

function replaceTextInRichText(document: RichTextDocument, translations: Map<string, string>): RichTextDocument {
    function traverse(node: RichTextNode): RichTextNode {
        if (node.nodeType === 'text' && node.value) {
            const translated = translations.get(node.value);
            return {
                ...node,
                value: translated || node.value,
            };
        }
        if (node.content) {
            return {
                ...node,
                content: node.content.map(traverse),
            };
        }
        return node;
    }
    
    return {
        ...document,
        content: document.content.map(traverse),
    };
}

async function translateRichText(document: RichTextDocument): Promise<RichTextDocument> {
    const texts = extractTextFromRichText(document);
    
    if (texts.length === 0) {
        return document;
    }
    
    // Combine all texts with markers to preserve context
    const combinedText = texts.join('\n\n');
    const translatedCombined = await translate(combinedText, LOCALE_FR, 'en');
    
    // Split back
    const translatedTexts = translatedCombined.split('\n\n');
    
    // Create mapping
    const translations = new Map<string, string>();
    texts.forEach((original, index) => {
        translations.set(original, translatedTexts[index] || original);
    });
    
    return replaceTextInRichText(document, translations);
}

async function translateTags(tags: string[]): Promise<string[]> {
    const combinedTags = tags.join(', ');
    const translated = await translate(combinedTags, LOCALE_FR, 'en');
    return translated.split(',').map(tag => tag.trim());
}

function displayRichText(document: RichTextDocument): string {
    return extractTextFromRichText(document).join(' ');
}

async function promptUser(question: string): Promise<string> {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.toLowerCase().trim());
        });
    });
}

async function translateRestaurants() {
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
    console.log(`📝 Translating: reviews${INCLUDE_TAGS ? ' + tags' : ''}`);
    
    if (DRY_RUN) {
        console.log('🔍 DRY RUN MODE - No changes will be made');
    }
    console.log();

    let updatedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    for (const restaurant of restaurants.items) {
        const name = restaurant.fields.name?.[LOCALE_FR] || restaurant.fields.name?.[LOCALE_EN] || restaurant.sys.id;
        const reviewFr = restaurant.fields.review?.[LOCALE_FR] as RichTextDocument | undefined;
        const tagsFr = INCLUDE_TAGS ? (restaurant.fields.tags?.[LOCALE_FR] as string[] | undefined) : undefined;
        
        // Skip if no French content to translate
        if (!reviewFr && !tagsFr) {
            console.log(`⏭️  Skipping ${name} (no French review${INCLUDE_TAGS ? ' or tags' : ''})`);
            skippedCount++;
            continue;
        }

        console.log('\n' + '='.repeat(80));
        console.log(`🍽️  Restaurant: ${name}`);
        console.log('='.repeat(80));

        try {
            let translatedReview: RichTextDocument | undefined;
            let translatedTags: string[] | undefined;

            // Translate review if exists
            if (reviewFr) {
                console.log('\n📝 Review (French):');
                console.log(displayRichText(reviewFr));
                
                translatedReview = await translateRichText(reviewFr);
                
                console.log('\n📝 Review (English - translated):');
                console.log(displayRichText(translatedReview));
            }

            // Translate tags if exist
            if (tagsFr && tagsFr.length > 0) {
                console.log('\n🏷️  Tags (French):');
                console.log(`   [${tagsFr.join(', ')}]`);
                
                translatedTags = await translateTags(tagsFr);
                
                console.log('\n🏷️  Tags (English - translated):');
                console.log(`   [${translatedTags.join(', ')}]`);
            }

            // Prompt user
            const answer = await promptUser('\n✅ Apply this translation? [y]es / [n]o / [s]kip / [q]uit: ');

            if (answer === 'q' || answer === 'quit') {
                console.log('\n👋 Quitting...');
                break;
            }

            if (answer === 'n' || answer === 'no') {
                console.log('❌ Skipped by user');
                skippedCount++;
                continue;
            }

            if (answer === 's' || answer === 'skip') {
                console.log('⏭️  Skipped');
                skippedCount++;
                continue;
            }

            if (answer === 'y' || answer === 'yes') {
                if (!DRY_RUN) {
                    console.log('✏️  Updating...');
                    const entry = await environment.getEntry(restaurant.sys.id);
                    
                    if (translatedReview) {
                        entry.fields.review = {
                            ...entry.fields.review,
                            [LOCALE_EN]: translatedReview,
                        };
                    }
                    
                    if (translatedTags) {
                        entry.fields.tags = {
                            ...entry.fields.tags,
                            [LOCALE_EN]: translatedTags,
                        };
                    }
                    
                    const updatedEntry = await entry.update();
                    await updatedEntry.publish();
                    console.log('✅ Updated and published!');
                } else {
                    console.log('✅ Would update (dry run)');
                }
                updatedCount++;
            } else {
                console.log('⏭️  Invalid input, skipping');
                skippedCount++;
            }

        } catch (error) {
            console.error(`❌ Failed to process ${name}:`, error instanceof Error ? error.message : error);
            errorCount++;
            
            // Ask user if they want to continue after an error
            const answer = await promptUser('\n⚠️  Continue to next restaurant? [y]es / [q]uit: ');
            if (answer === 'q' || answer === 'quit') {
                console.log('\n👋 Quitting...');
                break;
            }
        }
    }

    console.log('\n' + '='.repeat(80));
    console.log('✅ Done!');
    console.log(`   Updated: ${updatedCount}`);
    console.log(`   Skipped: ${skippedCount}`);
    console.log(`   Errors: ${errorCount}`);
    console.log(`   Total: ${restaurants.items.length}`);
    console.log('='.repeat(80));

    if (errorCount > 0) {
        console.log('\n⚠️  Some entries failed to process. Please check the errors above.');
        process.exit(1);
    }
}

translateRestaurants().catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
});

