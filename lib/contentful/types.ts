import type { EntryFieldTypes, EntrySkeletonType } from 'contentful';

export interface RestaurantSkeleton extends EntrySkeletonType {
  contentTypeId: 'restaurant';
  fields: {
    name: EntryFieldTypes.Symbol;
    review?: EntryFieldTypes.RichText;
    location?: EntryFieldTypes.Location;
    picture?: EntryFieldTypes.Array<EntryFieldTypes.AssetLink>;
    tags?: EntryFieldTypes.Array<EntryFieldTypes.Symbol>;
    instagram?: EntryFieldTypes.Symbol;
    favorite?: EntryFieldTypes.Boolean;
  };
}

export interface StaticPageSkeleton extends EntrySkeletonType {
  contentTypeId: 'staticPage';
  fields: {
    title: EntryFieldTypes.Symbol;
    body: EntryFieldTypes.RichText;
  };
}
