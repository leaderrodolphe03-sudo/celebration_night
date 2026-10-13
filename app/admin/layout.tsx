export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cn-black text-cn-white">
      {children}
    </div>
  );
}
