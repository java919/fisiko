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
      <rect width="18" height="18" x="3" y="3" rx="2" />
      <path d="M9 10h6" />
      <path d="M9 14h3" />
      <path d="M9 7v10" />
    </svg>
  );
}
