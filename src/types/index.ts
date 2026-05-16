export interface NavItem {
  title: string
  href: string
  disabled?: boolean
}

export interface Course {
  id: string
  title: string
  slug: string
  description?: string
  instructor: string
  price: number
  rating?: number
  modules: Module[]
}

export interface Module {
  id: string
  title: string
  order: number
  lessons: Lesson[]
}

export interface Lesson {
  id: string
  title: string
  content?: string
  videoUrl?: string
  order: number
}

export interface Lecture {
  id: string
  title: string
  slug: string
  tags: string[]
  body: string
  author: string
  category: string
  createdAt: string
}

export interface Testimonial {
  id: string
  name: string
  role: string
  content: string
  rating: number
}

export interface PricingPlan {
  id: string
  name: string
  price: number
  features: string[]
  period: string
}
