export const SUBSCRIPTION_TIERS = [
  {
    id: 'free',
    name: 'Free',
    price: 0,
    features: [
      '3 videos per month',
      'Basic templates',
      'Standard resolution',
      'Community support'
    ],
    limits: {
      videosPerMonth: 3,
      templatesAccess: 'basic' as const,
      nftMinting: false,
      prioritySupport: false,
    }
  },
  {
    id: 'creator',
    name: 'Creator',
    price: 29,
    features: [
      'Unlimited videos',
      'All templates',
      'HD resolution',
      'NFT minting',
      'Standard support'
    ],
    limits: {
      videosPerMonth: -1,
      templatesAccess: 'all' as const,
      nftMinting: true,
      prioritySupport: false,
    }
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 79,
    features: [
      'Everything in Creator',
      'Priority support',
      'Advanced analytics',
      'Custom templates',
      'API access'
    ],
    limits: {
      videosPerMonth: -1,
      templatesAccess: 'all' as const,
      nftMinting: true,
      prioritySupport: true,
    }
  }
];

export const TEMPLATE_CATEGORIES = [
  'Social Media',
  'Marketing',
  'Educational',
  'Entertainment',
  'Gaming',
  'Music',
  'Corporate',
  'Personal'
];

export const NFT_TYPES = [
  { id: 'video', name: 'Video NFT', description: 'Mint your video as an NFT' },
  { id: 'collectible', name: 'Collectible', description: 'Create limited edition collectibles' },
  { id: 'access', name: 'Access Token', description: 'Grant exclusive access to content' }
];
