# BigBag - Solana Memecoin Raffle Platform

A decentralized raffle platform built on Solana. Token holders are automatically entered into raffles with chances proportional to their holdings.

## Features

- Automatic raffle entries based on token holdings
- Real-time on-chain snapshots of token holders
- Transparent winner selection with weighted randomization
- Neon-themed UI with smooth animations
- Past winners history with transaction verification
- Mobile-responsive design

## How It Works

1. **Hold Tokens**: Every 50,000 tokens = 1 raffle entry
2. **Automatic Entry**: Token holders are automatically eligible
3. **Fair Selection**: Winners selected using weighted random selection
4. **Instant Prizes**: Winners receive SOL directly to their wallet

## Tech Stack

- Next.js 14 with App Router
- Tailwind CSS v4
- Radix UI + shadcn/ui
- Solana Web3.js
- Upstash Redis
- Helius RPC

## Prerequisites

- Node.js 18+
- Upstash Redis account ([upstash.com](https://upstash.com))
- Helius RPC API key ([helius.dev](https://helius.dev))
- Your Solana token mint address

## Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/yourusername/bigbag.git
cd bigbag
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Configure environment variables:

Copy `.env.example` to `.env.local` and fill in your values:

\`\`\`env
KV_REST_API_URL=your_upstash_redis_rest_url
KV_REST_API_TOKEN=your_upstash_redis_rest_token
NEXT_PUBLIC_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-api-key
NEXT_PUBLIC_MINT_ADDRESS=your_token_mint_address
NEXT_PUBLIC_ENTRY_THRESHOLD=50000
\`\`\`

4. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

5. Open [http://localhost:3000](http://localhost:3000)

## Configuration

### Upstash Redis

1. Create a free account at [upstash.com](https://upstash.com)
2. Create a new Redis database
3. Copy the REST URL and Token to your `.env.local`

### Helius RPC

1. Sign up at [helius.dev](https://helius.dev)
2. Create a new API key
3. Add it to your Helius RPC URL in `.env.local`

### Token Configuration

Set your Solana token mint address in `NEXT_PUBLIC_MINT_ADDRESS`. You can also customize the entry threshold ratio.

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── page.tsx           # Homepage
│   ├── game/              # Game pages
│   ├── how-it-works/      # Info pages
│   └── api/               # API routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── header.tsx        # Site header
│   ├── hero.tsx          # Hero section
│   └── ...
├── lib/                   # Utility libraries
│   ├── redis.ts          # Redis client & game logic
│   ├── helius.ts         # Solana RPC client
│   └── utils.ts          # Helper functions
└── public/               # Static assets
\`\`\`

## API Routes

- `GET /api/game/state` - Get current game state
- `GET /api/game/winners` - Get past winners list
- `GET /api/game/snapshot/:id` - Get specific snapshot data
- `POST /api/game/start` - Start new raffle round
- `POST /api/game/select-winner` - Select and announce winner

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

Remember to add all environment variables in your Vercel project settings.

## Customization

You can customize the raffle parameters by editing:

- Token mint address: `NEXT_PUBLIC_MINT_ADDRESS`
- Entry threshold: `NEXT_PUBLIC_ENTRY_THRESHOLD`
- UI colors: `app/globals.css`
- Branding: Update text in components

## License

MIT License - See LICENSE file for details

## Disclaimer

This is experimental software. Use at your own risk. Always do your own research before participating in any cryptocurrency project.
