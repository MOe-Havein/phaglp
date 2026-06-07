import { PageForm } from "@/components/control/page-form";

export const metadata = {
  title: "New Page — PHAGLP Control",
  description: "Create a new CMS page.",
};

export default function NewPage() {
  return (
    <div className="container mx-auto py-6">
      <PageForm />
    </div>
  );
}
