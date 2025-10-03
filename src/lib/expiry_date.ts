export function formatExpiry(expiry: string | null): string {
  if (!expiry) return "No active subscription";

  const expiryDate = new Date(expiry);
  const today = new Date();

  // difference in ms → days
  const diffTime = expiryDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const formattedDate = expiryDate.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  if (diffDays < 0) {
    return `Expired on ${formattedDate}`;
  }

  return `Active until ${formattedDate} (${diffDays} day${diffDays !== 1 ? "s" : ""} left)`;
}
