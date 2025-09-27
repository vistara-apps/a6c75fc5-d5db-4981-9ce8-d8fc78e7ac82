# CreatorVerse - NFT-Enhanced Video Creation Platform

CreatorVerse is an automated video generation platform that enables content creators to easily produce and monetize their videos through customizable templates, a media library, and exclusive digital collectibles on the Base blockchain.

## Features

### 🎬 Video Creation
- **Customizable Templates**: Professional video templates with easy customization
- **Royalty-Free Media Library**: Access to stock footage, music, and graphics
- **Automated Generation**: Streamlined video creation process

### 🎨 NFT Integration
- **Video NFTs**: Mint your videos as unique digital collectibles
- **Multiple NFT Types**: Video NFTs, collectibles, and access tokens
- **Base Blockchain**: Built on Base for fast, low-cost transactions

### 👥 Community Features
- **Subscriber Tiers**: Flexible subscription plans (Free, Creator, Pro)
- **Exclusive Content**: NFT-gated experiences for superfans
- **Engagement Tools**: Build stronger creator-fan relationships

### 🎮 Cyberpunk Theme
- **Gaming Aesthetic**: Dark purple background with neon green accents
- **Sharp Angular Borders**: Cyberpunk-inspired design elements
- **Animated Effects**: Glowing borders, floating elements, and smooth transitions

## Tech Stack

- **Frontend**: Next.js 15 with App Router, React 19, TypeScript
- **Styling**: Tailwind CSS with custom cyberpunk theme
- **Blockchain**: OnchainKit for Base integration, Wagmi for wallet connections
- **UI Components**: Custom glass-morphism components with neon effects

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Base wallet (MetaMask, Coinbase Wallet, etc.)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/creatorverse.git
cd creatorverse
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your configuration:
- Get OnchainKit API key from [Coinbase Developer Platform](https://portal.cdp.coinbase.com/products/onchainkit)
- Configure IPFS settings for NFT metadata storage

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
app/
├── components/          # Reusable UI components
│   ├── AppShell.tsx    # Main app layout with sidebar
│   ├── VideoTemplateCard.tsx
│   ├── NFTMintingForm.tsx
│   ├── SubscriberTierCard.tsx
│   └── ThemeProvider.tsx
├── theme-preview/       # Theme preview page
├── globals.css         # Global styles and theme variables
├── layout.tsx          # Root layout
├── page.tsx           # Homepage
└── providers.tsx      # OnchainKit provider setup

lib/
├── types.ts           # TypeScript type definitions
└── constants.ts       # App constants and configuration
```

## Key Components

### AppShell
Main application layout with:
- Responsive sidebar navigation
- Wallet connection integration
- Theme switching capabilities
- Glass-morphism design

### VideoTemplateCard
Template selection component featuring:
- Hover effects with neon glow
- Premium template indicators
- Customizable field previews

### NFTMintingForm
Comprehensive NFT creation form with:
- Multiple NFT types (video, collectible, access)
- Metadata configuration
- Pricing and royalty settings
- Advanced attributes support

### SubscriberTierCard
Subscription plan display with:
- Feature comparison
- Pricing information
- Current plan indicators
- Upgrade/downgrade actions

## Theme System

CreatorVerse supports multiple blockchain themes:

- **Default (CreatorVerse)**: Cyberpunk gaming aesthetic
- **Celo**: Black background with yellow accents
- **Solana**: Dark purple with magenta accents  
- **Base**: Dark blue with Base blue accents
- **Coinbase**: Dark navy with Coinbase blue

Themes use CSS variables for easy customization and can be switched dynamically.

## NFT Integration

### Supported NFT Types
1. **Video NFTs**: Mint videos as collectibles
2. **Collectibles**: Limited edition digital items
3. **Access Tokens**: Grant exclusive content access

### Blockchain Features
- Base Sepolia testnet support
- OnchainKit integration for wallet connections
- IPFS metadata storage
- Royalty configuration

## Subscription Tiers

### Free Tier
- 3 videos per month
- Basic templates
- Community support

### Creator Tier ($29/month)
- Unlimited videos
- All templates
- NFT minting
- Standard support

### Pro Tier ($79/month)
- Everything in Creator
- Priority support
- Advanced analytics
- Custom templates

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Environment Variables
See `.env.local` for required configuration variables.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Join our Discord community
- Check the documentation

---

Built with ❤️ for the creator economy on Base
