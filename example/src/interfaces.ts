interface Category {
  id: number;
  name: string;
  slug: string;
  icon: string;
  parent_id: number;
  hasChildren: boolean;
}

interface Product {
  id: number;
  name: string;
  description: string;
  props: Record<string, any>;
}

export type { Category, Product }