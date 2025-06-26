export function thousandSeparatorFormat(input: string): string {
  // Remove any existing commas and non-numeric characters except decimal point
  const cleanedInput = input.replace(/[^\d.]/g, '')

  // Split by decimal point to handle decimal numbers
  const parts = cleanedInput.split('.')

  // Add thousand separators to the integer part
  const integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // Reconstruct the number with decimal part if it exists
  return parts.length > 1 ? `${integerPart}.${parts[1]}` : integerPart
}
