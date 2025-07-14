export interface Icategory {
    id: number;
    name: string;
    slug: string;
    parentId?: number | null; // null nếu là danh mục cha
    active:boolean
  }

export type IcategoryForm = Omit<Icategory, "id">;
