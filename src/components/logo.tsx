export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`h-10 w-10 text-primary ${className}`}
    >
      <path d="M7 3h10" />
      <path d="M7 3v18" />
      <path d="M7 12h8" />
    </svg>
  );
}
