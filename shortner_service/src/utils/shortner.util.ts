import validator from 'validator';

export const generateShortCodeFromUrl = (url: string, length = 6): string => {
  // Combine URL and current timestamp
  const data = url + Date.now().toString();

  // Simple hash function (djb2)
  let hash = 5381;
  for (let i = 0; i < data.length; i++) {
    hash = (hash * 33) ^ data.charCodeAt(i);
  }

  // Convert to positive number
  hash = Math.abs(hash);

  // Convert to base62 for shorter code
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let shortCode = "";
  while (shortCode.length < length) {
    shortCode += chars[hash % chars.length];
    hash = Math.floor(hash / chars.length);
  }

  return shortCode;
};

export const isValidUrl = (url:string) : boolean => {
  return validator.isURL(url,{protocols: ["http","https"],require_protocol:true})
}