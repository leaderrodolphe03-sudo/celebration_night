import { PROGRAM } from "@/lib/event-config";

export default function EventTimeline() {
  return (
    <ol className="mx-auto flex max-w-lg flex-col gap-0">
      {PROGRAM.map((item, i) => (
        <li key={item.time} className="flex gap-4 border-l-2 border-[#F59E0B]/30 pb-6 pl-6 last:pb-0">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-1 h-3.5 w-3.5 rounded-full bg-[#F59E0B] shadow-[0_0_12px_#F59E0B]"
            />
          </div>
          <div className="-mt-1 flex flex-col text-left">
            <span className="font-heading text-lg font-bold tracking-wide text-[#FCD34D]">{item.time}</span>
            <span className="font-body text-sm text-[#EDE8DC]/85">{item.label}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
