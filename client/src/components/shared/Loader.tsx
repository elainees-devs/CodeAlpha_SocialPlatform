// src/components/shared/Loader.tsx

interface LoaderProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export const Loader = ({ className = "", size = "sm" }: LoaderProps) => {
  // We combine your base .loader class with any extra classes passed in
  return <div className={`loader ${className} loader-${size}`}></div>;
};