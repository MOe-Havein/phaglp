export function getCloudinaryFetchUrl(remoteUrl: string): string {
  if (!remoteUrl.startsWith("http")) return remoteUrl;
  return `https://res.cloudinary.com/demo/image/fetch/f_auto,q_auto,c_limit/${remoteUrl}`;
}
