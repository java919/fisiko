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
      <path d="M7 21V3h11" />
      <path d="M7 12h8" />
      <circle cx="12" cy="12" r="10" strokeOpacity="0.1" />
    </svg>
  );
}
