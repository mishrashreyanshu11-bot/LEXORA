export interface CountryOption {
  code: string;
  name: string;
  states: StateOption[];
}

export interface StateOption {
  code: string;
  name: string;
  cities: string[];
}

export const STANDARDIZED_LOCATIONS: CountryOption[] = [
  {
    code: 'IN',
    name: 'India',
    states: [
      {
        code: 'OR',
        name: 'Odisha',
        cities: ['Bhubaneswar', 'Cuttack', 'Puri', 'Rourkela', 'Sambalpur', 'Berhampur', 'Balasore'],
      },
      {
        code: 'MH',
        name: 'Maharashtra',
        cities: ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Thane', 'Aurangabad'],
      },
      {
        code: 'KA',
        name: 'Karnataka',
        cities: ['Bengaluru', 'Mysuru', 'Mangaluru', 'Hubballi', 'Belagavi'],
      },
      {
        code: 'DL',
        name: 'Delhi NCR',
        cities: ['New Delhi', 'South Delhi', 'North Delhi', 'Dwarka', 'Noida', 'Gurugram'],
      },
      {
        code: 'WB',
        name: 'West Bengal',
        cities: ['Kolkata', 'Howrah', 'Siliguri', 'Durgapur', 'Darjeeling'],
      },
      {
        code: 'TN',
        name: 'Tamil Nadu',
        cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem'],
      },
      {
        code: 'TS',
        name: 'Telangana',
        cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar'],
      },
      {
        code: 'GJ',
        name: 'Gujarat',
        cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Gandhinagar'],
      },
      {
        code: 'UP',
        name: 'Uttar Pradesh',
        cities: ['Lucknow', 'Varanasi', 'Kanpur', 'Agra', 'Prayagraj', 'Noida'],
      },
      {
        code: 'BR',
        name: 'Bihar',
        cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
      },
    ],
  },
  {
    code: 'US',
    name: 'United States',
    states: [
      {
        code: 'CA',
        name: 'California',
        cities: ['San Francisco', 'Los Angeles', 'San Diego', 'San Jose', 'Sacramento'],
      },
      {
        code: 'NY',
        name: 'New York',
        cities: ['New York City', 'Buffalo', 'Rochester', 'Albany', 'Syracuse'],
      },
      {
        code: 'TX',
        name: 'Texas',
        cities: ['Austin', 'Houston', 'Dallas', 'San Antonio', 'Fort Worth'],
      },
      {
        code: 'WA',
        name: 'Washington',
        cities: ['Seattle', 'Bellevue', 'Tacoma', 'Spokane', 'Olympia'],
      },
    ],
  },
  {
    code: 'GB',
    name: 'United Kingdom',
    states: [
      {
        code: 'ENG',
        name: 'England',
        cities: ['London', 'Manchester', 'Birmingham', 'Oxford', 'Cambridge'],
      },
      {
        code: 'SCT',
        name: 'Scotland',
        cities: ['Edinburgh', 'Glasgow', 'Aberdeen', 'Dundee'],
      },
    ],
  },
  {
    code: 'CA',
    name: 'Canada',
    states: [
      {
        code: 'ON',
        name: 'Ontario',
        cities: ['Toronto', 'Ottawa', 'Mississauga', 'Hamilton'],
      },
      {
        code: 'BC',
        name: 'British Columbia',
        cities: ['Vancouver', 'Victoria', 'Burnaby', 'Surrey'],
      },
    ],
  },
  {
    code: 'AU',
    name: 'Australia',
    states: [
      {
        code: 'NSW',
        name: 'New South Wales',
        cities: ['Sydney', 'Newcastle', 'Wollongong'],
      },
      {
        code: 'VIC',
        name: 'Victoria',
        cities: ['Melbourne', 'Geelong', 'Ballarat'],
      },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    states: [
      {
        code: 'IDF',
        name: 'Île-de-France',
        cities: ['Paris', 'Boulogne-Billancourt', 'Saint-Denis'],
      },
    ],
  },
];

export function getStatesForCountry(countryName: string): StateOption[] {
  const c = STANDARDIZED_LOCATIONS.find(
    item => item.name.toLowerCase() === countryName.toLowerCase() || item.code.toLowerCase() === countryName.toLowerCase()
  );
  return c ? c.states : [];
}

export function getCitiesForState(countryName: string, stateName: string): string[] {
  const states = getStatesForCountry(countryName);
  const s = states.find(
    item => item.name.toLowerCase() === stateName.toLowerCase() || item.code.toLowerCase() === stateName.toLowerCase()
  );
  return s ? s.cities : [];
}
