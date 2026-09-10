export interface NavItem {
  title: string;
  href: string;
  icon: string;
  disabled?: boolean;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description?: string;
  instructor: string;
  price: number;
  rating?: number;
  modules: Module[];
}

export interface Module {
  id: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface Lesson {
  id: string;
  title: string;
  content?: string;
  videoUrl?: string;
  order: number;
}

export interface Lecture {
  id: string;
  title: string;
  slug: string;
  tags: string[];
  body: string;
  author: string;
  category: string;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export interface PricingPlan {
  id: string;
  name: string;
  price: number;
  features: string[];
  period: string;
}

// ─── Admin / Inventory Domain ──────────────────────────────────────────────────

/** Generic server action response envelope — compatible with useActionState. */
export type ActionResponseState<T = unknown> = {
  success: boolean;
  data?: T | null;
  error?: string | null;
  fieldErrors?: Record<string, string[]>;
};

/** Full AcademyAsset as returned from DB (serialised). */
export interface AcademyAsset {
  id: string;
  sku: string;
  name: string;
  description: string | null;
  category: string; // AssetCategory enum value
  condition: string; // AssetCondition enum value
  status: string; // AssetStatus enum value
  quantity: number;
  quantityUnit: string;
  location: string | null;
  supplier: string | null;
  purchaseDate: string | null; // ISO string after serialisation
  purchasePrice: number | null;
  notes: string | null;
  courseId: string | null;
  course?: { id: string; title: string; slug: string } | null;
  allocations?: AssetAllocation[];
  createdAt: string;
  updatedAt: string;
}

/** A single allocation record — who holds how many units of an asset. */
export interface AssetAllocation {
  id: string;
  assetId: string;
  userId: string;
  quantity: number;
  allocatedAt: string;
  returnedAt: string | null;
  notes: string | null;
  user?: { id: string; name: string | null; email: string } | null;
}

/** Aggregate stats rendered on the admin dashboard. */
export interface AdminDashboardStats {
  userCount: number;
  courseCount: number;
  lectureCount: number;
  pageCount: number;
  assetCount: number;
  messageCount: number;
  unreadMessageCount: number;
}
