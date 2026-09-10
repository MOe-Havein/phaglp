import { notFound } from "next/navigation";
import { prisma, serializePrisma } from "@/lib/prisma";
import { EditBlogPostForm } from "@/components/control/edit-blog-post-form";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
    select: { title: true },
  });

  return {
    title: post
      ? `Edit: ${post.title} — PHAGLP Control`
      : "Edit Blog Post — PHAGLP Control",
  };
}

export default async function EditBlogPostPage({ params }: PageProps) {
  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  // Safe serialization before passing to Client component
  const serializedPost = serializePrisma(post);

  return (
    <div className="container mx-auto py-6">
      <EditBlogPostForm post={serializedPost} />
    </div>
  );
}
