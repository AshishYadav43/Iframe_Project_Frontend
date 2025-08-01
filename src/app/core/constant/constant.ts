
export const baseUrl: string = "http://localhost:3002/api/v1";
export const baseUserUrl: string = "http://localhost:3001/api/v1";
export const VALIDATION_PATTERNS = {
  email: '^[a-zA-Z0-9.@]*$',
  mobile: '^[0-9]*$',
  ipv4: '^[0-9.]*$',
  alphabets: '^[a-zA-Z\\s]+$',
  alphaNumericWithSpace: '^[A-Za-z0-9\\s]*$',
  alphabetsNumbersOnly: '^[A-Za-z0-9]*$'
};