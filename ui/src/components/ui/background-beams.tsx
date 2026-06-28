import { cn } from "@/lib/utils";

export const BackgroundBeams = ({
  className,
}: {
  className?: string;
}) => {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0 h-full w-full bg-[#0A0A0A] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]",
        className
      )}
    >
      <div className="absolute left-0 right-0 top-[-10%] h-[1000px] w-[1000px] rounded-full bg-[radial-gradient(circle_400px_at_50%_300px,#fbfbfb36,#000)] opacity-20 blur-[100px]" />
    </div>
  );
};
