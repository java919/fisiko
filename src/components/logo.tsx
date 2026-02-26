export function Logo({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`text-primary ${className || 'h-10 w-10'}`}
    >
      <path d="M7 21V3h11v3H10v5h7v3h-7v7z" />
    </svg>
  );
}
