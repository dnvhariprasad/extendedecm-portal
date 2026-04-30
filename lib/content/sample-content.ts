import type { Article, Product } from "@/lib/content/types";

export const products: Product[] = [
  {
    slug: "documentum",
    name: "Documentum",
    summary: "Repository, DFC, DQL, xCP, workflows, BOF/TBO/SBO customization, and operational troubleshooting.",
    focusAreas: ["Repository", "DFC", "DQL", "xCP", "Workflows", "BOF/TBO/SBO"],
  },
  {
    slug: "captiva",
    name: "Captiva",
    summary: "Capture flows, classification, extraction, validation, export modules, and scan operations.",
    focusAreas: ["Capture", "Classification", "Extraction", "Validation", "Export"],
  },
  {
    slug: "content-server",
    name: "OpenText Content Server",
    summary: "Enterprise content management, workspace design, permissions, records, and integration patterns.",
    focusAreas: ["Workspaces", "Permissions", "Records", "Search", "Integrations"],
  },
  {
    slug: "infoarchive",
    name: "InfoArchive",
    summary: "Application retirement, archive ingestion, retention, query models, and compliance access.",
    focusAreas: ["Ingestion", "Retention", "Query", "Compliance", "Operations"],
  },
  {
    slug: "xecm-engineering",
    name: "Extended ECM for Engineering",
    summary: "Engineering document control, transmittals, CAD integrations, and project collaboration.",
    focusAreas: ["Document Control", "Transmittals", "CAD", "Projects", "Collaboration"],
  },
  {
    slug: "vim",
    name: "Vendor Invoice Management",
    summary: "Invoice capture, SAP integration, workflows, exceptions, approvals, and operational support.",
    focusAreas: ["SAP", "Invoices", "Approvals", "Exceptions", "Reporting"],
  },
  {
    slug: "appworks",
    name: "AppWorks",
    summary: "Low-code applications, entities, process models, integrations, and deployment practices.",
    focusAreas: ["Entities", "Processes", "Integrations", "Deployment", "Security"],
  },
];

export const articles: Article[] = [
  {
    slug: "documentum-repository-basics",
    title: "Documentum Repository Basics",
    excerpt: "A first reference page showing how structured blocks, notes, code snippets, and diagrams will render.",
    type: "Learning Note",
    productSlug: "documentum",
    featured: true,
    blocks: [
      {
        id: "intro",
        type: "rich-text",
        html: "<p>Documentum content is stored as typed objects in a repository. Project notes should capture object model decisions, lifecycle behavior, foldering strategy, ACL patterns, and integration touchpoints.</p>",
      },
      {
        id: "architecture",
        type: "mermaid",
        title: "Repository Access Flow",
        source: `sequenceDiagram
  participant User
  participant Portal
  participant DFC
  participant Repository
  User->>Portal: Request document operation
  Portal->>DFC: Create authenticated session
  DFC->>Repository: Execute query or content operation
  Repository-->>DFC: Return object metadata/content
  DFC-->>Portal: Normalize response
  Portal-->>User: Render outcome`,
      },
      {
        id: "dql",
        type: "code",
        language: "sql",
        filename: "sample.dql",
        code: "select r_object_id, object_name, r_object_type from dm_document where any i_folder_id = '0b000000000000000'",
      },
      {
        id: "session-note",
        type: "note",
        variant: "warning",
        title: "Session lifecycle",
        body: "Implementation notes should explicitly document session ownership, release behavior, retry paths, and error evidence for DFC-based customizations.",
      },
    ],
  },
  {
    slug: "error-resolution-template",
    title: "Error Resolution Template",
    excerpt: "A reusable structure for recording evidence, impact, root cause, and verified remediation.",
    type: "Troubleshooting Note",
    featured: true,
    blocks: [
      {
        id: "structure",
        type: "steps",
        title: "Recommended troubleshooting structure",
        steps: ["Capture exact error text and timestamps.", "Identify first failure before retry noise.", "Map the failing component and call path.", "Record verified remediation and regression checks."],
      },
      {
        id: "note",
        type: "note",
        variant: "info",
        title: "Keep evidence concrete",
        body: "Prefer exact log strings, query snippets, stack traces, screenshots, and source locations over general descriptions.",
      },
    ],
  },
  {
    slug: "portable-diagram-practice",
    title: "Portable Diagram Practice",
    excerpt: "How the portal should preserve source diagrams while rendering clean visual explanations.",
    type: "Architecture Pattern",
    featured: true,
    blocks: [
      {
        id: "diagram-guideline",
        type: "rich-text",
        html: "<p>Every rendered diagram should retain its source format. Store Mermaid text, draw.io files, or Excalidraw JSON along with PNG/SVG exports so migration remains manageable.</p>",
      },
    ],
  },
];

export function getProduct(slug: string) {
  return products.find((product) => product.slug === slug);
}

export function getArticle(slug: string) {
  return articles.find((article) => article.slug === slug);
}

export function getFeaturedArticles() {
  return articles.filter((article) => article.featured);
}
