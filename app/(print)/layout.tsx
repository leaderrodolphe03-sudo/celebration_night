export default function PrintLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#17165A] text-white print:bg-white print:text-black">
      {children}
    </div>
  );
}
