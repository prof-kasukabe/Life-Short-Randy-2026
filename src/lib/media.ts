/**
 * Extract or resolve a thumbnail URL from a media item's link or custom thumbnail.
 */
export function getMediaThumbnail(url?: string, customThumbnailUrl?: string): string | null {
  if (customThumbnailUrl && customThumbnailUrl.trim() !== '') {
    return customThumbnailUrl;
  }
  if (!url) return null;

  const trimmed = url.trim();

  // YouTube match (watch?v=, youtu.be/, embed/, shorts/)
  const ytMatch = trimmed.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?|shorts)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/i);
  if (ytMatch && ytMatch[1]) {
    return `https://img.youtube.com/vi/${ytMatch[1]}/hqdefault.jpg`;
  }

  return null;
}
