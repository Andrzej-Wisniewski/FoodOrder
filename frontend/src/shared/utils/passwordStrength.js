const LABELS = [
  'Bardzo słabe',
  'Słabe',
  'Średnie',
  'Dobre',
  'Silne',
  'Bardzo silne',
];

const COLORS = [
  '#ff4444',
  '#ff8844',
  '#ffcc44',
  '#88cc44',
  '#44cc44',
  '#44cc88',
];

export function calculatePasswordStrength(password) {
  if (!password) return { score: 0, label: '', color: COLORS[0] };

  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return {
    score,
    label: LABELS[score] || LABELS[0],
    color: COLORS[score] || COLORS[0],
  };
}
