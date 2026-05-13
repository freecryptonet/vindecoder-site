export interface UsState {
  slug: string;
  name: string;
  abbr: string;
  dmvName: string;
  dmvUrl: string;
  /** Whether the state offers a public/free vehicle history or VIN lookup. */
  hasPublicVinLookup: boolean;
}

export const US_STATES: UsState[] = [
  { slug: "alabama", name: "Alabama", abbr: "AL", dmvName: "Alabama Department of Revenue, Motor Vehicle Division", dmvUrl: "https://www.revenue.alabama.gov/motor-vehicle/", hasPublicVinLookup: false },
  { slug: "alaska", name: "Alaska", abbr: "AK", dmvName: "Alaska DMV", dmvUrl: "https://doa.alaska.gov/dmv/", hasPublicVinLookup: false },
  { slug: "arizona", name: "Arizona", abbr: "AZ", dmvName: "Arizona DOT Motor Vehicle Division", dmvUrl: "https://azdot.gov/mvd", hasPublicVinLookup: false },
  { slug: "arkansas", name: "Arkansas", abbr: "AR", dmvName: "Arkansas DFA, Office of Motor Vehicle", dmvUrl: "https://www.dfa.arkansas.gov/motor-vehicle/", hasPublicVinLookup: false },
  { slug: "california", name: "California", abbr: "CA", dmvName: "California DMV", dmvUrl: "https://www.dmv.ca.gov/", hasPublicVinLookup: false },
  { slug: "colorado", name: "Colorado", abbr: "CO", dmvName: "Colorado DMV", dmvUrl: "https://dmv.colorado.gov/", hasPublicVinLookup: false },
  { slug: "connecticut", name: "Connecticut", abbr: "CT", dmvName: "Connecticut DMV", dmvUrl: "https://portal.ct.gov/dmv", hasPublicVinLookup: false },
  { slug: "delaware", name: "Delaware", abbr: "DE", dmvName: "Delaware DMV", dmvUrl: "https://www.dmv.de.gov/", hasPublicVinLookup: false },
  { slug: "district-of-columbia", name: "District of Columbia", abbr: "DC", dmvName: "DC DMV", dmvUrl: "https://dmv.dc.gov/", hasPublicVinLookup: false },
  { slug: "florida", name: "Florida", abbr: "FL", dmvName: "Florida Highway Safety and Motor Vehicles", dmvUrl: "https://www.flhsmv.gov/", hasPublicVinLookup: true },
  { slug: "georgia", name: "Georgia", abbr: "GA", dmvName: "Georgia Department of Driver Services", dmvUrl: "https://dds.georgia.gov/", hasPublicVinLookup: false },
  { slug: "hawaii", name: "Hawaii", abbr: "HI", dmvName: "Hawaii DMV (county-administered)", dmvUrl: "https://hidot.hawaii.gov/", hasPublicVinLookup: false },
  { slug: "idaho", name: "Idaho", abbr: "ID", dmvName: "Idaho DMV", dmvUrl: "https://dmv.idaho.gov/", hasPublicVinLookup: false },
  { slug: "illinois", name: "Illinois", abbr: "IL", dmvName: "Illinois Secretary of State", dmvUrl: "https://www.ilsos.gov/", hasPublicVinLookup: false },
  { slug: "indiana", name: "Indiana", abbr: "IN", dmvName: "Indiana BMV", dmvUrl: "https://www.in.gov/bmv/", hasPublicVinLookup: false },
  { slug: "iowa", name: "Iowa", abbr: "IA", dmvName: "Iowa DOT", dmvUrl: "https://iowadot.gov/mvd/", hasPublicVinLookup: false },
  { slug: "kansas", name: "Kansas", abbr: "KS", dmvName: "Kansas DOR Division of Vehicles", dmvUrl: "https://www.ksrevenue.gov/dovindex.html", hasPublicVinLookup: false },
  { slug: "kentucky", name: "Kentucky", abbr: "KY", dmvName: "Kentucky Transportation Cabinet", dmvUrl: "https://drive.ky.gov/", hasPublicVinLookup: false },
  { slug: "louisiana", name: "Louisiana", abbr: "LA", dmvName: "Louisiana Office of Motor Vehicles", dmvUrl: "https://www.expresslane.org/", hasPublicVinLookup: false },
  { slug: "maine", name: "Maine", abbr: "ME", dmvName: "Maine BMV", dmvUrl: "https://www.maine.gov/sos/bmv/", hasPublicVinLookup: false },
  { slug: "maryland", name: "Maryland", abbr: "MD", dmvName: "Maryland MVA", dmvUrl: "https://mva.maryland.gov/", hasPublicVinLookup: false },
  { slug: "massachusetts", name: "Massachusetts", abbr: "MA", dmvName: "Massachusetts RMV", dmvUrl: "https://www.mass.gov/orgs/massachusetts-registry-of-motor-vehicles", hasPublicVinLookup: false },
  { slug: "michigan", name: "Michigan", abbr: "MI", dmvName: "Michigan Secretary of State", dmvUrl: "https://www.michigan.gov/sos", hasPublicVinLookup: false },
  { slug: "minnesota", name: "Minnesota", abbr: "MN", dmvName: "Minnesota DPS Driver and Vehicle Services", dmvUrl: "https://dps.mn.gov/divisions/dvs/", hasPublicVinLookup: false },
  { slug: "mississippi", name: "Mississippi", abbr: "MS", dmvName: "Mississippi DOR", dmvUrl: "https://www.dor.ms.gov/", hasPublicVinLookup: false },
  { slug: "missouri", name: "Missouri", abbr: "MO", dmvName: "Missouri DOR", dmvUrl: "https://dor.mo.gov/motor-vehicle/", hasPublicVinLookup: false },
  { slug: "montana", name: "Montana", abbr: "MT", dmvName: "Montana MVD", dmvUrl: "https://dojmt.gov/driving/", hasPublicVinLookup: false },
  { slug: "nebraska", name: "Nebraska", abbr: "NE", dmvName: "Nebraska DMV", dmvUrl: "https://dmv.nebraska.gov/", hasPublicVinLookup: false },
  { slug: "nevada", name: "Nevada", abbr: "NV", dmvName: "Nevada DMV", dmvUrl: "https://dmv.nv.gov/", hasPublicVinLookup: false },
  { slug: "new-hampshire", name: "New Hampshire", abbr: "NH", dmvName: "New Hampshire DMV", dmvUrl: "https://www.dmv.nh.gov/", hasPublicVinLookup: false },
  { slug: "new-jersey", name: "New Jersey", abbr: "NJ", dmvName: "New Jersey MVC", dmvUrl: "https://www.state.nj.us/mvc/", hasPublicVinLookup: false },
  { slug: "new-mexico", name: "New Mexico", abbr: "NM", dmvName: "New Mexico MVD", dmvUrl: "https://www.mvd.newmexico.gov/", hasPublicVinLookup: false },
  { slug: "new-york", name: "New York", abbr: "NY", dmvName: "New York DMV", dmvUrl: "https://dmv.ny.gov/", hasPublicVinLookup: false },
  { slug: "north-carolina", name: "North Carolina", abbr: "NC", dmvName: "North Carolina DMV", dmvUrl: "https://www.ncdot.gov/dmv/", hasPublicVinLookup: false },
  { slug: "north-dakota", name: "North Dakota", abbr: "ND", dmvName: "North Dakota DOT", dmvUrl: "https://www.dot.nd.gov/divisions/mv/", hasPublicVinLookup: false },
  { slug: "ohio", name: "Ohio", abbr: "OH", dmvName: "Ohio BMV", dmvUrl: "https://bmv.ohio.gov/", hasPublicVinLookup: false },
  { slug: "oklahoma", name: "Oklahoma", abbr: "OK", dmvName: "Service Oklahoma", dmvUrl: "https://oklahoma.gov/service.html", hasPublicVinLookup: false },
  { slug: "oregon", name: "Oregon", abbr: "OR", dmvName: "Oregon DMV", dmvUrl: "https://www.oregon.gov/odot/dmv/", hasPublicVinLookup: false },
  { slug: "pennsylvania", name: "Pennsylvania", abbr: "PA", dmvName: "PennDOT", dmvUrl: "https://www.dmv.pa.gov/", hasPublicVinLookup: false },
  { slug: "rhode-island", name: "Rhode Island", abbr: "RI", dmvName: "Rhode Island DMV", dmvUrl: "https://dmv.ri.gov/", hasPublicVinLookup: false },
  { slug: "south-carolina", name: "South Carolina", abbr: "SC", dmvName: "South Carolina DMV", dmvUrl: "https://www.scdmvonline.com/", hasPublicVinLookup: false },
  { slug: "south-dakota", name: "South Dakota", abbr: "SD", dmvName: "South Dakota DPS", dmvUrl: "https://dps.sd.gov/", hasPublicVinLookup: false },
  { slug: "tennessee", name: "Tennessee", abbr: "TN", dmvName: "Tennessee Department of Revenue", dmvUrl: "https://www.tn.gov/revenue/title-and-registration.html", hasPublicVinLookup: false },
  { slug: "texas", name: "Texas", abbr: "TX", dmvName: "Texas DMV", dmvUrl: "https://www.txdmv.gov/", hasPublicVinLookup: false },
  { slug: "utah", name: "Utah", abbr: "UT", dmvName: "Utah DMV", dmvUrl: "https://dmv.utah.gov/", hasPublicVinLookup: false },
  { slug: "vermont", name: "Vermont", abbr: "VT", dmvName: "Vermont DMV", dmvUrl: "https://dmv.vermont.gov/", hasPublicVinLookup: false },
  { slug: "virginia", name: "Virginia", abbr: "VA", dmvName: "Virginia DMV", dmvUrl: "https://www.dmv.virginia.gov/", hasPublicVinLookup: false },
  { slug: "washington", name: "Washington", abbr: "WA", dmvName: "Washington DOL", dmvUrl: "https://www.dol.wa.gov/", hasPublicVinLookup: false },
  { slug: "west-virginia", name: "West Virginia", abbr: "WV", dmvName: "West Virginia DMV", dmvUrl: "https://transportation.wv.gov/DMV/", hasPublicVinLookup: false },
  { slug: "wisconsin", name: "Wisconsin", abbr: "WI", dmvName: "Wisconsin DMV", dmvUrl: "https://wisconsindot.gov/Pages/dmv/default.aspx", hasPublicVinLookup: false },
  { slug: "wyoming", name: "Wyoming", abbr: "WY", dmvName: "Wyoming DOT", dmvUrl: "https://dot.state.wy.us/", hasPublicVinLookup: false },
];

export function findState(slug: string): UsState | undefined {
  return US_STATES.find((s) => s.slug === slug);
}
