import { notFound } from "next/navigation";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { getStaticPageBySlug } from "@/lib/contentful/static-pages";
import { getPreferredLocale } from "@/lib/contentful/locale";
import { richTextOptions } from "@/lib/contentful/richTextOptions";
import BackToHomeLink from "@/app/components/BackToHomeLink";

interface StaticPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function StaticPage({ params }: StaticPageProps) {
  const { slug } = await params;

  // Explicitly exclude restaurants route
  if (slug === "restaurants") {
    notFound();
  }

  const locale = await getPreferredLocale();
  const page = await getStaticPageBySlug(slug, locale);

  if (!page) {
    notFound();
  }

  const { title, body } = page.fields;

  return (
    <article>
      <BackToHomeLink />
      <h2 className="text-2xl font-semibold text-gray-900 mb-4">{title}</h2>
      {body && (
        <div className="text-sm text-gray-700 mt-4 prose prose-sm max-w-none">
          {documentToReactComponents(body as Document, richTextOptions)}
        </div>
      )}
    </article>
  );
}

