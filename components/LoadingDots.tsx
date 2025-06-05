'use client';

export function LoadingDots() {
  return (
    <div className="flex items-center gap-1 p-2">
      <svg width="40" height="20" viewBox="0 0 40 20" fill="none">
        <circle cx="6" cy="10" r="3" fill="currentColor" className="animate-pulse">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0s"
          />
        </circle>
        <circle cx="20" cy="10" r="3" fill="currentColor" className="animate-pulse">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.5s"
            repeatCount="indefinite"
            begin="0.5s"
          />
        </circle>
        <circle cx="34" cy="10" r="3" fill="currentColor" className="animate-pulse">
          <animate
            attributeName="opacity"
            values="0.4;1;0.4"
            dur="1.5s"
            repeatCount="indefinite"
            begin="1s"
          />
        </circle>
      </svg>
    </div>
  );
}