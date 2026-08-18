// The Phase 1 acquisition landing page's own small, curated category list —
// separate from the marketplace's 388-item expert taxonomy (categories
// table). Each entry optionally maps to one or more real taxonomy category
// ids so the admin demand-gap analytics (Round 5) can join marketing-level
// demand against actual expert supply without a second taxonomy edit UI.
export type AcquisitionCategory = {
  key: string;
  label: string;
  mappedCategoryIds: string[];
};

export const ACQUISITION_CATEGORIES: AcquisitionCategory[] = [
  {
    key: "starting_a_business",
    label: "Starting a Business",
    mappedCategoryIds: ["8e755e29-f6ea-4604-bb72-40481e5841e2"], // Starting & Building a Business
  },
  {
    key: "growing_my_business",
    label: "Growing My Business",
    mappedCategoryIds: [
      "637bd454-1cf3-4e93-83b7-dd4c4a6373cb", // Leadership, Management & Operations
      "d19f7e9f-3285-4730-904a-278a835ba220", // Sales, Partnerships & Expansion
    ],
  },
  {
    key: "marketing_sales",
    label: "Marketing & Sales",
    mappedCategoryIds: [
      "556d5096-befd-4a05-8943-d233a79af951", // Marketing, Brand & Growth
      "d19f7e9f-3285-4730-904a-278a835ba220", // Sales, Partnerships & Expansion
    ],
  },
  {
    key: "career",
    label: "Career",
    mappedCategoryIds: ["da11e925-dd34-468c-acb0-0f0f83f2fdb7"], // Career & Professional Development
  },
  {
    key: "money_investment",
    label: "Money & Investment",
    mappedCategoryIds: ["0cd5ab9d-edde-4e77-9496-04258124cd30"], // Funding, Investment & Finance
  },
  {
    key: "technology",
    label: "Technology",
    mappedCategoryIds: [
      "8de528b2-b852-4fbd-960a-60bbb38af38e", // Product, Technology & AI
      "53587490-c31b-4ad9-a09f-6f5fc5f2f42d", // Technology (industry)
    ],
  },
  {
    key: "real_estate",
    label: "Real Estate",
    mappedCategoryIds: ["fd5fa3f1-6508-4326-968e-b473da57c1e4"], // Real Estate (industry)
  },
  {
    key: "creative_fashion",
    label: "Creative & Fashion",
    mappedCategoryIds: [
      "68b695db-4c4c-488d-ac29-e9ef89202e28", // Fashion (industry)
      "7d7c09f8-5658-4ef6-8538-d8be83f37847", // Creator Economy (industry)
    ],
  },
  {
    key: "health_wellness",
    label: "Health & Wellness",
    mappedCategoryIds: ["d84b1bd1-708a-4b3a-8338-bfa81802849b"], // Healthcare (industry)
  },
  {
    key: "something_else",
    label: "Something Else",
    mappedCategoryIds: [],
  },
];

export function acquisitionCategoryLabel(key: string): string {
  return ACQUISITION_CATEGORIES.find((c) => c.key === key)?.label ?? key;
}
