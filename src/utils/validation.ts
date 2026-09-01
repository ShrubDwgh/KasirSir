/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function isStrongPassword(password: string): boolean {
  // Minimal 8 karakter, minimal 1 huruf besar, 1 huruf kecil, 1 angka
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /\d/.test(password)
  );
}

/**
 * Validate product name
 */
export function isValidProductName(name: string): boolean {
  return name.trim().length >= 3 && name.trim().length <= 100;
}

/**
 * Validate price
 */
export function isValidPrice(price: number): boolean {
  return price > 0 && Number.isFinite(price);
}

/**
 * Validate stock quantity
 */
export function isValidStock(stock: number): boolean {
  return Number.isInteger(stock) && stock >= 0;
}

/**
 * Validate barcode format
 */
export function isValidBarcode(barcode: string): boolean {
  return barcode.trim().length > 0 && barcode.trim().length <= 50;
}
