export type SeedLocation = {
  seedId: string;
  name: string;
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
  type: string;
  officeHours: string;
};

export type SeedTask = {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  summary: string;
  category: string;
  estimatedDays: string;
  estimatedCostBdt: number;
  difficulty: string;
  documents: string[];
  aiSummary: string;
  communityTip: string;
  coverLabel: string;
  reviewCount: number;
  savedCount: number;
  popularityScore: number;
  isPublished: boolean;
  steps: {
    title: string;
    description: string;
    order: number;
    estimatedTime: string;
    estimatedCost: number;
    documents: string[];
    tips: string[];
    contributionLocked: boolean;
    locationSeedId?: string;
  }[];
};

export const fallbackLocations: SeedLocation[] = [
  {
    seedId: 'passport-office-agargaon',
    name: 'Agargaon Passport Office',
    address: 'Passport Bhaban, Agargaon, Dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.778,
    longitude: 90.3792,
    type: 'Government Office',
    officeHours: 'Sun-Thu, 9:00 AM-4:00 PM',
  },
  {
    seedId: 'sonali-bank-agargaon',
    name: 'Sonali Bank Agargaon Branch',
    address: 'Agargaon, Dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7735,
    longitude: 90.3797,
    type: 'Bank',
    officeHours: 'Sun-Thu, 10:00 AM-4:00 PM',
  },
  {
    seedId: 'shahbagh-police-station',
    name: 'Shahbagh Police Station',
    address: 'Shahbagh, Dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7389,
    longitude: 90.3944,
    type: 'Government Office',
    officeHours: 'Open 24 hours',
  },
  {
    seedId: 'dhaka-bank-dhanmondi',
    name: 'Dhaka Bank Dhanmondi Branch',
    address: 'Road 27, Dhanmondi, Dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7465,
    longitude: 90.3747,
    type: 'Bank',
    officeHours: 'Sun-Thu, 10:00 AM-4:00 PM',
  },
  {
    seedId: 'branch-service-booth',
    name: 'Customer Service Booth',
    address: 'Inside Dhanmondi branch lobby',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7462,
    longitude: 90.3744,
    type: 'Service Desk',
    officeHours: 'Sun-Thu, 10:00 AM-4:00 PM',
  },
  {
    seedId: 'nid-copy-dhanmondi',
    name: 'Dhanmondi Print & Copy Center',
    address: 'Dhanmondi 27, beside bank branch',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7471,
    longitude: 90.3751,
    type: 'Support Service',
    officeHours: 'Daily, 9:00 AM-9:00 PM',
  },
  {
    seedId: 'dncc-office-gulshan',
    name: 'Dhaka North City Corporation Office',
    address: 'Gulshan 2, Dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7925,
    longitude: 90.4078,
    type: 'Government Office',
    officeHours: 'Sun-Thu, 9:00 AM-4:00 PM',
  },
  {
    seedId: 'municipal-fee-booth',
    name: 'Municipal Fee Collection Booth',
    address: 'Inside DNCC premises, Gulshan 2',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7928,
    longitude: 90.4081,
    type: 'Bank',
    officeHours: 'Sun-Thu, 10:00 AM-3:30 PM',
  },
  {
    seedId: 'ward-copy-shop-gulshan',
    name: 'Ward Copy & Print Shop',
    address: 'Near Gulshan ward office gate',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.792,
    longitude: 90.4072,
    type: 'Support Service',
    officeHours: 'Daily, 8:30 AM-9:00 PM',
  },
  {
    seedId: 'tejgaon-land-office',
    name: 'Tejgaon Land Office',
    address: 'Tejgaon Industrial Area, Dhaka',
    city: 'Dhaka',
    country: 'Bangladesh',
    latitude: 23.7638,
    longitude: 90.4058,
    type: 'Government Office',
    officeHours: 'Sun-Thu, 9:00 AM-4:00 PM',
  },
];

export const fallbackTasks: SeedTask[] = [
  {
    slug: 'apply-passport',
    title: 'Apply for a Passport',
    tagline: 'Complete your passport process without unnecessary trips.',
    description:
      'Prepare documents, verify at the passport office, pay fees, complete biometrics, and follow police verification.',
    summary:
      'A guided workflow for preparing documents, visiting the correct offices, paying fees, and tracking police verification.',
    category: 'Government Service',
    estimatedDays: '7-10 days',
    estimatedCostBdt: 4070,
    difficulty: 'Moderate',
    documents: [
      'National ID card or online birth registration certificate',
      'Existing passport copy if reissue',
      'Recent passport-size photos',
      'Profession certificate or student ID where applicable',
      'Utility bill copy for address proof',
      'Completed online application summary',
    ],
    aiSummary:
      'Shohoj Path recommends completing photo, photocopies, and online form review before office hours begin.',
    communityTip:
      'Users report the fastest flow is form review at home, bank payment before noon, then passport office visit.',
    coverLabel: 'Government Services',
    reviewCount: 120,
    savedCount: 386,
    popularityScore: 94,
    isPublished: true,
    steps: [
      {
        title: 'Prepare required documents',
        description:
          'Collect the full checklist and verify that your name, date of birth, and address match across records.',
        order: 1,
        estimatedTime: '1 day',
        estimatedCost: 0,
        documents: [
          'NID or birth certificate',
          'Passport-size photos',
          'Profession proof',
        ],
        tips: [
          'Keep two extra photocopy sets.',
          'Double-check English spellings before submission.',
        ],
        contributionLocked: false,
      },
      {
        title: 'Visit passport office for verification',
        description:
          'Go to your assigned regional passport office to verify the online application and documents.',
        order: 2,
        estimatedTime: '1 day',
        estimatedCost: 0,
        documents: ['Application summary', 'Original ID', 'Photocopies'],
        tips: [
          'Reach before the main rush begins.',
          'Carry printed copies even if the form is online.',
        ],
        contributionLocked: false,
        locationSeedId: 'passport-office-agargaon',
      },
      {
        title: 'Submit application and biometrics',
        description:
          'Submit your signed package, fingerprints, digital signature, and on-site photograph.',
        order: 3,
        estimatedTime: '1 hour',
        estimatedCost: 2000,
        documents: ['Signed form', 'All supporting documents'],
        tips: [
          'Keep the delivery slip safe.',
          'Ask the officer to confirm missing fields before leaving.',
        ],
        contributionLocked: false,
        locationSeedId: 'passport-office-agargaon',
      },
      {
        title: 'Pay fees at partner bank',
        description:
          'Complete passport fee payment and collect the stamped receipt.',
        order: 4,
        estimatedTime: '30 min',
        estimatedCost: 2070,
        documents: ['Application reference'],
        tips: [
          'Carry small-change cash backup.',
          'Take a photo of the stamped bank receipt.',
        ],
        contributionLocked: false,
        locationSeedId: 'sonali-bank-agargaon',
      },
      {
        title: 'Police verification and collection',
        description:
          'Stay reachable for verification, then collect the passport when tracking shows it is ready.',
        order: 5,
        estimatedTime: '3-5 days',
        estimatedCost: 0,
        documents: ['Original ID', 'Address proof', 'Delivery slip'],
        tips: [
          'Inform household members in advance.',
          'Check name spelling before leaving the counter.',
        ],
        contributionLocked: true,
        locationSeedId: 'shahbagh-police-station',
      },
    ],
  },
  {
    slug: 'open-bank-account',
    title: 'Open a Bank Account',
    tagline: 'Know the exact documents, branch flow, and next best stop.',
    description:
      'Choose a branch, prepare KYC documents, submit forms, deposit the opening balance, and activate services.',
    summary:
      'A citizen-friendly path for selecting a branch, collecting account forms, submitting KYC, and activating your account.',
    category: 'Banking',
    estimatedDays: '1-2 days',
    estimatedCostBdt: 1200,
    difficulty: 'Easy',
    documents: [
      'National ID card',
      'Passport-size photographs',
      'Proof of address',
      'TIN certificate if required',
    ],
    aiSummary:
      'The fastest path starts with confirming branch-specific introducer and photo requirements before visiting.',
    communityTip:
      'Community contributors recommend calling the branch first because KYC rules vary between branches.',
    coverLabel: 'Banking',
    reviewCount: 84,
    savedCount: 214,
    popularityScore: 88,
    isPublished: true,
    steps: [
      {
        title: 'Choose branch and account type',
        description:
          'Compare savings, student, and current account requirements and shortlist the nearest branch.',
        order: 1,
        estimatedTime: '20 min',
        estimatedCost: 0,
        documents: ['National ID'],
        tips: [
          'Check minimum balance policy.',
          'Confirm introducer requirement by phone.',
        ],
        contributionLocked: false,
      },
      {
        title: 'Prepare KYC documents',
        description:
          'Fill in the customer information form and attach photographs and identity documents.',
        order: 2,
        estimatedTime: '45 min',
        estimatedCost: 0,
        documents: ['Photographs', 'Address proof', 'TIN if needed'],
        tips: ['Bring a pen.', 'Write your phone number clearly on the form.'],
        contributionLocked: false,
        locationSeedId: 'nid-copy-dhanmondi',
      },
      {
        title: 'Submit at branch and deposit',
        description:
          'Submit the form, make the opening deposit, and collect the stamped receipt.',
        order: 3,
        estimatedTime: '1 hour',
        estimatedCost: 1200,
        documents: ['Completed form', 'Original documents'],
        tips: [
          'Ask about debit card delivery timeline.',
          'Take a photo of the deposit receipt.',
        ],
        contributionLocked: false,
        locationSeedId: 'dhaka-bank-dhanmondi',
      },
      {
        title: 'Activate mobile banking',
        description:
          'Complete final activation instructions before leaving the branch.',
        order: 4,
        estimatedTime: '20 min',
        estimatedCost: 0,
        documents: ['Deposit receipt', 'NID'],
        tips: ['Set transaction alerts before leaving.'],
        contributionLocked: true,
        locationSeedId: 'branch-service-booth',
      },
    ],
  },
  {
    slug: 'get-trade-license',
    title: 'Get a Trade License',
    tagline: 'For small businesses that need a clearer municipal process.',
    description:
      'Confirm jurisdiction, prepare business and property documents, submit the form, pay fees, and collect approval.',
    summary:
      'A structured municipal task path for identifying the correct office, preparing business documents, and tracking approval status.',
    category: 'Citizen Support',
    estimatedDays: '3-5 days',
    estimatedCostBdt: 5600,
    difficulty: 'Complex',
    documents: [
      'National ID',
      'Passport-size photos',
      'TIN certificate',
      'Rental agreement',
      'Holding tax receipt',
    ],
    aiSummary:
      'Most delays happen because applicants visit the wrong municipal desk or miss property-related papers.',
    communityTip:
      'Confirm ward office jurisdiction before collecting signatures.',
    coverLabel: 'Citizen Support',
    reviewCount: 56,
    savedCount: 162,
    popularityScore: 79,
    isPublished: true,
    steps: [
      {
        title: 'Confirm municipality jurisdiction',
        description:
          'Identify which city corporation or municipality office handles your business address.',
        order: 1,
        estimatedTime: '30 min',
        estimatedCost: 0,
        documents: ['Business address details'],
        tips: [
          'Use the ward map first.',
          'Confirm the correct counter number.',
        ],
        contributionLocked: false,
        locationSeedId: 'dncc-office-gulshan',
      },
      {
        title: 'Prepare property and owner documents',
        description:
          'Collect holding tax receipt, tenancy agreement or ownership papers, and applicant ID.',
        order: 2,
        estimatedTime: '1 day',
        estimatedCost: 0,
        documents: ['NID', 'Tax receipt', 'Tenancy or ownership papers'],
        tips: ['Carry originals plus two photocopy sets.'],
        contributionLocked: false,
        locationSeedId: 'ward-copy-shop-gulshan',
      },
      {
        title: 'Submit application',
        description:
          'Complete the trade license form and submit it to the municipal desk.',
        order: 3,
        estimatedTime: '1 day',
        estimatedCost: 3500,
        documents: ['Filled form', 'Supporting documents'],
        tips: ['Ask for expected review timeline in writing if possible.'],
        contributionLocked: false,
        locationSeedId: 'dncc-office-gulshan',
      },
      {
        title: 'Pay processing charges',
        description:
          'Clear municipal fees at the linked payment counter and keep the receipt.',
        order: 4,
        estimatedTime: '30 min',
        estimatedCost: 2100,
        documents: ['Application slip'],
        tips: ['Check if digital payment is accepted.'],
        contributionLocked: true,
        locationSeedId: 'municipal-fee-booth',
      },
      {
        title: 'Collect trade license',
        description:
          'Pick up the approved license and verify the business name and address.',
        order: 5,
        estimatedTime: '30 min',
        estimatedCost: 0,
        documents: ['Application receipt'],
        tips: ['Scan the final license immediately.'],
        contributionLocked: true,
        locationSeedId: 'dncc-office-gulshan',
      },
    ],
  },
];
