// utils/phone-formatter.ts
export const formatNigerianPhoneNumberWithCode = (phone: string): string => {
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '')

  // If it starts with 0 and is 11 digits, convert to international format
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    return `+234${cleaned.slice(1)}`
  }

  // Return the original if it doesn't match expected formats
  return phone
}

export const formatNigerianPhoneNumberWithoutCode = (phone: string): string => {
  if (!phone) return ''
  // Remove the country code +234 if present
  if (phone.startsWith('+234')) {
    const withoutCode = phone.slice(4)
    // Ensure it starts with 0
    return `0${withoutCode}`
  }
  return phone
}
