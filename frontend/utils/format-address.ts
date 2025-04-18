/**
 * Extracts city and state abbreviation from a full address string
 * Example: "2855 Stevens Creek Boulevard, San Jose, California 95050, United States" -> "San Jose, CA"
 */
export function formatCityState(fullAddress: string): string {
   // If no address is provided, return empty string
   if (!fullAddress) return '';
   
   // US state abbreviations mapping
   const stateAbbreviations: Record<string, string> = {
     'alabama': 'AL',
     'alaska': 'AK',
     'arizona': 'AZ',
     'arkansas': 'AR',
     'california': 'CA',
     'colorado': 'CO',
     'connecticut': 'CT',
     'delaware': 'DE',
     'florida': 'FL',
     'georgia': 'GA',
     'hawaii': 'HI',
     'idaho': 'ID',
     'illinois': 'IL',
     'indiana': 'IN',
     'iowa': 'IA',
     'kansas': 'KS',
     'kentucky': 'KY',
     'louisiana': 'LA',
     'maine': 'ME',
     'maryland': 'MD',
     'massachusetts': 'MA',
     'michigan': 'MI',
     'minnesota': 'MN',
     'mississippi': 'MS',
     'missouri': 'MO',
     'montana': 'MT',
     'nebraska': 'NE',
     'nevada': 'NV',
     'new hampshire': 'NH',
     'new jersey': 'NJ',
     'new mexico': 'NM',
     'new york': 'NY',
     'north carolina': 'NC',
     'north dakota': 'ND',
     'ohio': 'OH',
     'oklahoma': 'OK',
     'oregon': 'OR',
     'pennsylvania': 'PA',
     'rhode island': 'RI',
     'south carolina': 'SC',
     'south dakota': 'SD',
     'tennessee': 'TN',
     'texas': 'TX',
     'utah': 'UT',
     'vermont': 'VT',
     'virginia': 'VA',
     'washington': 'WA',
     'west virginia': 'WV',
     'wisconsin': 'WI',
     'wyoming': 'WY',
     'district of columbia': 'DC'
   };
 
   // Split the address by commas
   const parts = fullAddress.split(',').map(part => part.trim());
   
   // Try to find city and state
   // Typically in US addresses, city is followed by state
   // We'll look for a state name in the parts
   for (let i = 0; i < parts.length - 1; i++) {
     const potentialState = parts[i + 1].toLowerCase().split(' ')[0];
     
     // Check if this part contains a state name
     for (const [stateName, abbr] of Object.entries(stateAbbreviations)) {
       if (parts[i + 1].toLowerCase().includes(stateName)) {
         // Found a state, so the previous part is likely the city
         return `${parts[i]}, ${abbr}`;
       }
     }
   }
   
   return parts.length > 1 ? parts[1] : fullAddress;
 }
 