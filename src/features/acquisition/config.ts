// The acquisition landing page's category list — the marketplace's real 8
// top-level taxonomy categories (categories table, parent_id IS NULL),
// matching the Pivotroom design system's §36 "Primary Pivotroom business
// categories" exactly, so what a visitor picks maps 1:1 onto real expert
// supply rather than a separate marketing-only relabeling. Each entry maps
// to exactly one real taxonomy category id, so the admin demand-gap
// analytics can join demand against actual expert supply without a second
// taxonomy edit UI.
export type AcquisitionCategory = {
  key: string;
  label: string;
  mappedCategoryIds: string[];
};

export const ACQUISITION_CATEGORIES: AcquisitionCategory[] = [
  {
    key: "starting_building",
    label: "Starting & building",
    mappedCategoryIds: ["8e755e29-f6ea-4604-bb72-40481e5841e2"], // Starting & Building a Business
  },
  {
    key: "funding_finance",
    label: "Funding & finance",
    mappedCategoryIds: ["0cd5ab9d-edde-4e77-9496-04258124cd30"], // Funding, Investment & Finance
  },
  {
    key: "marketing_growth",
    label: "Marketing & growth",
    mappedCategoryIds: ["556d5096-befd-4a05-8943-d233a79af951"], // Marketing, Brand & Growth
  },
  {
    key: "sales_expansion",
    label: "Sales & expansion",
    mappedCategoryIds: ["d19f7e9f-3285-4730-904a-278a835ba220"], // Sales, Partnerships & Expansion
  },
  {
    key: "leadership_operations",
    label: "Leadership & operations",
    mappedCategoryIds: ["637bd454-1cf3-4e93-83b7-dd4c4a6373cb"], // Leadership, Management & Operations
  },
  {
    key: "product_technology_ai",
    label: "Product, technology & AI",
    mappedCategoryIds: ["8de528b2-b852-4fbd-960a-60bbb38af38e"], // Product, Technology & AI
  },
  {
    key: "career_professional",
    label: "Career & professional",
    mappedCategoryIds: ["da11e925-dd34-468c-acb0-0f0f83f2fdb7"], // Career & Professional Development
  },
  {
    key: "industry_expertise",
    label: "Industry expertise",
    mappedCategoryIds: ["1e6c7ee8-b81f-4d13-9a1a-b4b11b3895cf"], // Industry & Specialized Expertise
  },
];

export function acquisitionCategoryLabel(key: string): string {
  return ACQUISITION_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
