import { PROGRAM } from "@/lib/event-config";

export default function EventTimeline() {
  return (
    <ol className="mx-auto flex max-w-lg flex-col gap-0">
      {PROGRAM.map((item, i) => (
        <li key={item.time} className="flex gap-4 border-l border-white/10 pb-6 pl-6 last:pb-0">
          <div className="relative">
            <span
              aria-hidden
              className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-cn-gold"
            />
          </div>
          <div className="-mt-1 flex flex-col text-left">
            <span className="font-heading text-lg tracking-wide text-cn-gold">{item.time}</span>
            <span className="font-body text-sm text-cn-gray-300">{item.label}</span>
          </div>
        </li>
      ))}
    </ol>
  );
}
