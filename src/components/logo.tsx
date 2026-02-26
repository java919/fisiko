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
      <path d="M18 3H6v18" />
      <path d="M6 11h9" />
      <circle cx="15" cy="11" r="1" fill="currentColor" />
    </svg>
  );
}
