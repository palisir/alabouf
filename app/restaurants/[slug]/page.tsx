import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { getRestaurantBySlug } from "@/lib/contentful/restaurants";
import { richTextOptions } from "@/lib/contentful/richTextOptions";
import ShareButton from "@/app/components/ShareButton";

interface RestaurantPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = await getRestaurantBySlug(slug);

  if (!restaurant) {
    notFound();
  }

  const { name, favorite, instagram, tags, review } = restaurant.fields;

  return (
    <>
      <article>
        <div className="flex items-start justify-between gap-3 mb-4">
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900 leading-tight">
            {name}
            &nbsp;
            {favorite && <span className="text-(--color-primary) text-xl font-medium">♥</span>}
          </h2>
          <div className="flex items-center gap-3 shrink-0">
            <ShareButton title={name} url={`/restaurants/${slug}`} />
          </div>
        </div>

        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {instagram && (
          <div className="mb-6">
            <a
              href={instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-(--color-primary) hover:text-(--color-primary-dark) hover:underline transition-colors duration-200"
            >
              {instagram}
            </a>
          </div>
        )}

        {review && (
          <div className="mt-6 prose prose-sm md:prose-base max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-(--color-primary) prose-a:no-underline hover:prose-a:underline prose-strong:text-gray-900">
            {documentToReactComponents(review as Document, richTextOptions)}
          </div>
        )}
      </article>
    </>
  );
}
