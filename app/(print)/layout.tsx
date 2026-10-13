export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-cn-black text-cn-gray-100 print:bg-white print:text-black">
      {children}
    </div>
  );
}
