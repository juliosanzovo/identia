export function PageHeader({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <header className="mb-6">
      <h1 className="text-xl font-semibold text-neutral-900">{title}</h1>
      {description && (
        <p className="mt-1 text-sm text-neutral-600">{description}</p>
      )}
    </header>
  );
}
