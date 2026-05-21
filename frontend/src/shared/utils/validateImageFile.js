const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_SIZE_BYTES = 5 * 1024 * 1024;

export function validateImageFile(file) {
  if (!file) return 'Nie wybrano pliku.';

  if (!ALLOWED_TYPES.includes(file.type)) {
    return 'Dozwolone formaty: JPG, PNG, WebP.';
  }

  if (file.size > MAX_SIZE_BYTES) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    return `Plik jest za duży (${sizeMB} MB). Maksymalnie 5 MB.`;
  }

  return null;
}
