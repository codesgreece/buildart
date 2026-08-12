export function BuildartLogo({
  className = "",
  variant = "full",
}: {
  className?: string;
  variant?: "full" | "mark" | "wordmark";
}) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      {(variant === "full" || variant === "mark") && (
        <svg
          width="28"
          height="28"
          viewBox="0 0 40 40"
          fill="none"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="18"
            width="14"
            height="19"
            fill="currentColor"
            className="text-[var(--ba-accent)]"
          />
          <path d="M17 18 L28 8 L37 18 V37 H17 V18 Z" fill="currentColor" />
          <rect x="22" y="24" width="6" height="8" fill="var(--ba-bg)" opacity="0.9" />
          <rect x="7" y="24" width="5" height="6" fill="var(--ba-bg)" opacity="0.85" />
        </svg>
      )}
      {(variant === "full" || variant === "wordmark") && (
        <span
          className="font-display tracking-[-0.04em] text-[1.35rem] leading-none"
          style={{ letterSpacing: "-0.04em" }}
        >
          BUILD<span className="text-[var(--ba-accent)]">ART</span>
        </span>
      )}
    </span>
  );
}
