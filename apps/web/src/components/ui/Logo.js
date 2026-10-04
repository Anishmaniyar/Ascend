export default function Logo({ className = "h-7 w-7" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Abstract geometric mark — two overlapping squares forming an L shape */}
      <rect
        x="2"
        y="2"
        width="16"
        height="16"
        rx="3"
        fill="currentColor"
        opacity="1"
      />
      <rect
        x="10"
        y="10"
        width="16"
        height="16"
        rx="3"
        fill="currentColor"
        opacity="0.4"
      />
    </svg>
  );
}
