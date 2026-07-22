export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <div className="space-y-1">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
        {title}
      </h1>
      {description ? (
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {description}
        </p>
      ) : null}
    </div>
  );
}

export function ActionBar({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-2 justify-end">{children}</div>;
}
