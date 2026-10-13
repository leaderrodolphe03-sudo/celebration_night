export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#17110E] text-[#EDE8DC] print:bg-white print:text-black">
      {children}
    </div>
  );
}
