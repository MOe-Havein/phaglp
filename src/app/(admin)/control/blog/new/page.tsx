import { CreateBlogPostForm } from "@/components/control/create-blog-post-form";

export const metadata = {
  title: "New Blog Post — PHAGLP Control",
  description: "Draft a new community blog post.",
};

export default function NewBlogPostPage() {
  return (
    <div className="container mx-auto py-6">
      <CreateBlogPostForm />
    </div>
  );
}
