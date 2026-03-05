export function formatPay(min: number | null, max: number | null, type: string): string {
  if (!min && !max) return 'Pay not listed';

  const format = (n: number) =>
    type === 'salary'
      ? `$${(n / 1000).toFixed(0)}k`
      : `$${n.toFixed(2)}`;

  if (min && max) {
    return `${format(min)} - ${format(max)}/${type === 'salary' ? 'yr' : 'hr'}`;
  }
  if (min) return `From ${format(min)}/${type === 'salary' ? 'yr' : 'hr'}`;
  if (max) return `Up to ${format(max)}/${type === 'salary' ? 'yr' : 'hr'}`;
  return 'Pay not listed';
}

export function timeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (seconds < 60) return 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks}w ago`;
  return date.toLocaleDateString();
}

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
