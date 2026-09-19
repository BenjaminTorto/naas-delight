const PepperIcon = ({ filled, color = '#C9A84C' }) => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    style={{ opacity: filled ? 1 : 0.35, flexShrink: 0 }}
  >
    <path d="M9 4c-1.2 1.8-1.4 3.6.2 5C6.8 9.4 5 11.4 5 14a5 5 0 0 0 10 0c0-1.7-.6-2.8-1.7-3.8C14.8 9.6 16.8 7.8 17 5.2" />
  </svg>
);

// Renders nothing for level 0 (mild/no explicit heat), so dishes like
// drinks or plain sides don't show an irrelevant empty scale.
const HeatLevel = ({ level = 0, max = 3 }) => {
  if (!level) return null;
  return (
    <div
      className="flex items-center gap-0.5"
      title={`Spice level ${level}/${max}`}
      aria-label={`Spice level ${level} of ${max}`}
    >
      {Array.from({ length: max }).map((_, i) => (
        <PepperIcon key={i} filled={i < level} />
      ))}
    </div>
  );
};

export default HeatLevel;
