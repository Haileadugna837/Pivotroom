export type FinderOption = { value: string; label: string };

export const FINDER_IDENTITIES: FinderOption[] = [
  { value: "founder", label: "Founder / Business Owner" },
  { value: "startup_founder", label: "Startup Founder" },
  { value: "professional", label: "Professional / Employee" },
  { value: "manager", label: "Manager / Executive" },
  { value: "freelancer", label: "Freelancer / Consultant" },
  { value: "student", label: "Student / Graduate" },
  { value: "investor", label: "Investor" },
  { value: "creator", label: "Creator" },
  { value: "other", label: "Other" },
];

const OTHER_PROBLEM: FinderOption = { value: "other", label: "Other" };
const NOT_SURE_PROBLEM: FinderOption = { value: "not_sure", label: "I'm not sure yet" };

// Editable without touching any component — the wizard, the results-page
// breadcrumb, and the admin dashboard's "Most Requested Problems" list all
// read from this single map.
export const FINDER_PROBLEMS_BY_IDENTITY: Record<string, FinderOption[]> = {
  founder: [
    { value: "grow_business", label: "Grow my business" },
    { value: "more_customers", label: "Get more customers" },
    { value: "improve_marketing", label: "Improve marketing" },
    { value: "improve_sales", label: "Improve sales" },
    { value: "raise_investment", label: "Raise investment" },
    { value: "build_team", label: "Build my team" },
    { value: "improve_operations", label: "Improve operations" },
    { value: "expand_markets", label: "Expand into new markets" },
    { value: "start_exporting", label: "Start exporting" },
    { value: "financial_management", label: "Improve financial management" },
    { value: "personal_brand", label: "Build my personal brand" },
    { value: "strategic_advice", label: "Get strategic advice" },
    { value: "specific_problem", label: "Solve a specific business problem" },
    NOT_SURE_PROBLEM,
    OTHER_PROBLEM,
  ],
  startup_founder: [
    { value: "grow_business", label: "Grow my business" },
    { value: "raise_investment", label: "Raise investment" },
    { value: "product_market_fit", label: "Find product-market fit" },
    { value: "build_team", label: "Build my team" },
    { value: "strategic_advice", label: "Get strategic advice" },
    { value: "improve_marketing", label: "Improve marketing" },
    { value: "improve_sales", label: "Improve sales" },
    NOT_SURE_PROBLEM,
    OTHER_PROBLEM,
  ],
  professional: [
    { value: "better_job", label: "Find a better job" },
    { value: "change_careers", label: "Change careers" },
    { value: "get_promoted", label: "Get promoted" },
    { value: "leadership_skills", label: "Improve leadership skills" },
    { value: "personal_brand", label: "Build my personal brand" },
    { value: "cv_linkedin", label: "Improve my CV / LinkedIn" },
    { value: "negotiate_salary", label: "Negotiate salary" },
    { value: "side_business", label: "Start a side business" },
    { value: "professional_skills", label: "Improve professional skills" },
    { value: "learn_from_industry", label: "Learn from someone in my industry" },
    OTHER_PROBLEM,
  ],
  manager: [
    { value: "leadership_skills", label: "Improve leadership skills" },
    { value: "build_team", label: "Build and manage my team" },
    { value: "improve_operations", label: "Improve operations" },
    { value: "strategic_advice", label: "Get strategic advice" },
    { value: "get_promoted", label: "Get promoted" },
    { value: "personal_brand", label: "Build my personal brand" },
    OTHER_PROBLEM,
  ],
  freelancer: [
    { value: "more_customers", label: "Get more clients" },
    { value: "improve_marketing", label: "Improve marketing" },
    { value: "personal_brand", label: "Build my personal brand" },
    { value: "financial_management", label: "Improve financial management" },
    { value: "strategic_advice", label: "Get strategic advice" },
    OTHER_PROBLEM,
  ],
  student: [
    { value: "better_job", label: "Find a job" },
    { value: "change_careers", label: "Choose a career path" },
    { value: "cv_linkedin", label: "Improve my CV / LinkedIn" },
    { value: "learn_from_industry", label: "Learn from someone in my industry" },
    { value: "professional_skills", label: "Improve professional skills" },
    OTHER_PROBLEM,
  ],
  investor: [
    { value: "sourcing_deals", label: "Source better deals" },
    { value: "due_diligence", label: "Get help with due diligence" },
    { value: "strategic_advice", label: "Get strategic advice" },
    OTHER_PROBLEM,
  ],
  creator: [
    { value: "personal_brand", label: "Build my personal brand" },
    { value: "grow_business", label: "Turn my audience into a business" },
    { value: "improve_marketing", label: "Improve marketing" },
    { value: "more_customers", label: "Get more customers" },
    OTHER_PROBLEM,
  ],
  other: [NOT_SURE_PROBLEM, { value: "strategic_advice", label: "Get strategic advice" }, OTHER_PROBLEM],
};

export function problemLabel(identity: string | null, problem: string | null): string | null {
  if (!identity || !problem) return null;
  return (FINDER_PROBLEMS_BY_IDENTITY[identity] ?? []).find((p) => p.value === problem)?.label ?? null;
}

export function identityLabel(identity: string | null): string | null {
  if (!identity) return null;
  return FINDER_IDENTITIES.find((i) => i.value === identity)?.label ?? null;
}
