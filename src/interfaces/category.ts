export interface Icategory {
    id: number;
    name: string;
    slug: string;
    parentId?: number | null; 
    active:boolean
  }

export type IcategoryForm = Omit<Icategory, "id">;
