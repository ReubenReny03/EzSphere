export const formatDate = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

export const formatDateTime = (date) => {
  if (!date) return '—';
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
};

export const formatNumber = (value, options = {}) =>
  new Intl.NumberFormat('en-US', options).format(value ?? 0);

export const formatCO2 = (kg) => {
  if (kg == null) return '—';
  if (kg >= 1000) return `${(kg / 1000).toFixed(1)} t CO₂e`;
  return `${formatNumber(kg, { maximumFractionDigits: 1 })} kg CO₂e`;
};

export const formatScore = (value) => `${Math.round(value ?? 0)} / 100`;

export const timeAgo = (date) => {
  if (!date) return '—';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const units = [
    ['year', 31536000],
    ['month', 2592000],
    ['day', 86400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [name, secs] of units) {
    const value = Math.floor(seconds / secs);
    if (value >= 1) return `${value} ${name}${value > 1 ? 's' : ''} ago`;
  }
  return 'just now';
};
