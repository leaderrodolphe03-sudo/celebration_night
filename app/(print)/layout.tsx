export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#0A0304] text-white print:bg-white print:text-black">
      {children}
    </div>
  );
}
