import { cn } from "@/lib/utils";

interface LoaderProps {
  text?: string;
  fullScreen?: boolean;
}

export default function Loader({
  text = "Loading...",
  fullScreen = true,
}: LoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        fullScreen && "h-screen w-full"
      )}
    >
      {/* Spinner */}
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-muted border-t-primary" />

      {/* Text */}
      <p className="text-sm text-muted-foreground">{text}</p>
    </div>
  );
}