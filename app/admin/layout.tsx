export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cn-black text-cn-white pb-20 md:pb-0 selection:bg-cn-gold selection:text-cn-black">
      {children}
    </div>
  );
}
