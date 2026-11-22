export default function ArtfolioLogo({
  markOnly = false,
  className,
}: {
  markOnly?: boolean;
  className?: string;
}) {
  return (
    <svg
      aria-label="Artfolio"
      className={className}
      role="img"
      viewBox={markOnly ? '0 0 180 180' : '0 0 760 180'}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="14"
        y="14"
        width="152"
        height="152"
        rx="34"
        fill="var(--artfolio-logo-surface)"
        stroke="var(--artfolio-logo-accent)"
        strokeWidth="2"
      />
      <path
        d="M47 125 90 48l43 77M64 96h52"
        stroke="var(--artfolio-logo-accent)"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="m90 27 2.8 6.2L99 36l-6.2 2.8L90 45l-2.8-6.2L81 36l6.2-2.8L90 27Z"
        fill="var(--artfolio-logo-accent)"
      />
      {!markOnly && (
        <>
          <text
            x="202"
            y="105"
            fill="var(--artfolio-logo-text)"
            fontFamily="Georgia, 'Times New Roman', serif"
            fontSize="61"
            letterSpacing="9"
          >
            ARTFOLIO
          </text>
          <path
            d="M204 126h518"
            stroke="var(--artfolio-logo-accent)"
            strokeOpacity=".55"
          />
          <text
            x="205"
            y="151"
            fill="var(--artfolio-logo-accent)"
            fontFamily="Arial, Helvetica, sans-serif"
            fontSize="13"
            letterSpacing="5"
          >
            A HOME FOR ARTISTS
          </text>
        </>
      )}
    </svg>
  );
}
