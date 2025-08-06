
export const baseUrl: string = "http://localhost:3002/api/v1";
export const baseUserUrl: string = "http://localhost:3001/api/v1";
export const VALIDATION_PATTERNS = {
  email: '^[a-zA-Z0-9.@]*$',
  mobile: '^[0-9]*$',
  ipv4: '^[0-9.]*$',
  alphabets: '^[a-zA-Z\\s]*$',
  alphaNumericWithSpace: '^[A-Za-z0-9\\s]*$',
  alphabetsNumbersOnly: '^[A-Za-z0-9]*$',
  alphabetsOnly: '^[a-zA-Z]*$',
  password: '^[^<>]*$',
  region: '^[a-zA-Z-]*$',
  floatNumber: '^[0-9.]*$',
};
export const STATIC_SPORTS = {
  SOCCER: { id: 1, name: "soccer" },
  TENNIS: { id: 2, name: "tennis" },
  GOLF: { id: 3, name: "golf" },
  CRICKET: { id: 4, name: "cricket" },
  RUGBY_UNION: { id: 5, name: "rugbyunion" },
  RUGBY_LEAGUE: { id: 1477, name: "rugbyleague" },
  HORSE_RACING: { id: 7, name: "horseracing" },
  BASKETBALL: { id: 7522, name: "basketball" },
  ICEHOCKEY: { id: 11, name: "icehockey" },
  GREYHOUND_RACING: { id: 3503, name: "greyhound" },
};


export const SPORT_TYPES = [
  { _id: "MANUAL", name: "Manual" },
  { _id: "LOTTERY", name: "Lottery" },
  { _id: "LIVE", name: "Live" },
  { _id: "VIRTUAL", name: "Virtual" },
  { _id: "TABLE", name: "Table" },
  { _id: "SLOT", name: "Slot" }
];

export const SPORT_CATEGORIES_NAME = {
  SPORTS: 'SPORTS',
  CASINO: 'CASINO',
  ESPORTS: 'ESPORTS',
  VIRTUAL_GAMING: 'VIRTUAL GAMING',
};

export const COMPANY_SELECTION_V1 = {
  OUR: 1,
  OTHER: 2,
};

export const SPORT_CATEGORIES = {
  SPORTS: 1,
  CASINO: 2,
  ESPORTS: 3,
  VIRTUALGAMING: 4,
};