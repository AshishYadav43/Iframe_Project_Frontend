export const baseUrl: string = "http://localhost:3001/api/v1";

export const VALIDATION_PATTERNS = {
  email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$',
  mobile: '^[0-9]*$',
  ipv4: '^[0-9.]+$',
  alphabets: '^[a-zA-Z\\s]+$',
  numbers: '^[0-9]+$',
  alphaNumericWithSpace: '^[A-Za-z0-9\\s]*$'
};