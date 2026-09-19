// A compact motif of interlocking chevrons and diamonds, evoking the
// geometric weave of Ghanaian kente cloth, rendered in a single line
// weight so it sits quietly alongside the site's existing hairline rules.
// Used in place of the plain gold divider before section eyebrow labels.
const KenteAccent = ({ width = 40, color = '#C9A84C', style = {} }) => {
  const height = Math.round((width / 40) * 10);
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 40 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ display: 'block', flexShrink: 0, ...style }}
      aria-hidden="true"
    >
      <path d="M0 5H4" stroke={color} strokeWidth="1" />
      <path d="M6 1L10 5L6 9" stroke={color} strokeWidth="1" fill="none" />
      <rect x="12" y="3.5" width="3" height="3" transform="rotate(45 13.5 5)" fill={color} />
      <path d="M18 1L22 5L18 9" stroke={color} strokeWidth="1" fill="none" />
      <rect x="24" y="3.5" width="3" height="3" transform="rotate(45 25.5 5)" fill={color} opacity="0.55" />
      <path d="M30 1L34 5L30 9" stroke={color} strokeWidth="1" fill="none" />
      <path d="M36 5H40" stroke={color} strokeWidth="1" />
    </svg>
  );
};

export default KenteAccent;
