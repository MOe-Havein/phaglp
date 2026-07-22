import {
  Users,
  BookOpen,
  FileText,
  Package,
  Mail,
  FileCode,
} from "lucide-react";

const links = [
  { title: "Users", href: "/control/users", icon: Users },
  { title: "Courses", href: "/control/courses", icon: BookOpen },
  { title: "Lectures", href: "/control/lectures", icon: FileText },
  { title: "Assets", href: "/control/assets", icon: Package },
  { title: "CMS", href: "/control/pages", icon: FileCode },
  { title: "Messages", href: "/control/messages", icon: Mail },
];

export function CustomAdminDashboard() {
  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Custom Admin Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
          Theme override from <code>admin-theme</code> package showing basic
          stats and navigation.
        </p>
      </section>
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {links.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900"
          >
            <item.icon className="w-5 h-5 text-gray-700 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
              {item.title}
            </span>
          </a>
        ))}
      </section>
    </div>
  );
}
