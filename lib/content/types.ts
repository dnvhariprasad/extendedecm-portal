export type Product = {
  slug: string;
  name: string;
  summary: string;
  focusAreas: string[];
};

export type ArticleType =
  | "Implementation Guide"
  | "Architecture Pattern"
  | "Troubleshooting Note"
  | "Learning Note"
  | "DQL Snippet";

export type ContentBlock =
  | {
      id: string;
      type: "rich-text";
      html: string;
    }
  | {
      id: string;
      type: "heading";
      level: 2 | 3;
      text: string;
    }
  | {
      id: string;
      type: "note";
      variant: "info" | "warning" | "success" | "danger";
      title: string;
      body: string;
    }
  | {
      id: string;
      type: "code";
      language: string;
      filename?: string;
      code: string;
    }
  | {
      id: string;
      type: "mermaid";
      title: string;
      source: string;
    }
  | {
      id: string;
      type: "steps";
      title: string;
      steps: string[];
    };

export type Article = {
  slug: string;
  title: string;
  excerpt: string;
  type: ArticleType;
  productSlug?: string;
  featured?: boolean;
  blocks: ContentBlock[];
};
