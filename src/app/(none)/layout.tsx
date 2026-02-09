export default function EmptyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Need to render using fragment otherwise it won't accept rendering children
  return <>{children}</>;
}
