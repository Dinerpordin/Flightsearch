# AI-Powered Flight Search Application

A modern, AI-enabled flight search application built with Next.js and deployed on Vercel.

## Features

- ✈️ Real-time flight search and comparison
- 🤖 AI-powered recommendations for optimal flight choices
- 💰 Price tracking and best deal identification
- 📊 Visual comparison of flight options
- 🎯 Personalized suggestions based on user preferences
- 📱 Fully responsive design
- ⚡ Fast performance with Next.js

## Tech Stack

- **Framework**: Next.js 14
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **AI Integration**: OpenAI/OpenRouter API
- **Deployment**: Vercel
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager
- AI API keys (OpenAI or OpenRouter)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Dinerpordin/Flightsearch.git
cd Flightsearch
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env.local` file:
```env
NEXT_PUBLIC_API_URL=your_flight_api_url
OPENAI_API_KEY=your_openai_api_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
Flightsearch/
├── app/                    # Next.js app directory
│   ├── page.tsx           # Main flight search page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── api/               # API routes
│       └── ai-recommend/  # AI recommendation endpoint
├── components/            # React components
│   ├── FlightSearch.tsx   # Flight search component
│   ├── FlightCard.tsx     # Flight display card
│   └── AIRecommendation.tsx # AI recommendation display
├── lib/                   # Utility functions
│   ├── flight-api.ts      # Flight API integration
│   └── ai-helper.ts       # AI integration helpers
├── public/                # Static assets
├── package.json
├── next.config.js
├── tailwind.config.ts
└── tsconfig.json
```

## AI Features

The application uses AI to:

1. **Analyze Flight Options**: Compare prices, duration, layovers
2. **Provide Recommendations**: Suggest best flights based on:
   - Budget constraints
   - Time preferences
   - Comfort level
   - Travel class
3. **Predict Price Trends**: Historical data analysis
4. **Personalize Results**: Learn from user behavior

## Deployment on Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

### Environment Variables for Vercel:

- `NEXT_PUBLIC_API_URL`
- `OPENAI_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## API Integration

### Supported Flight APIs:

- Amadeus Flight API
- Skyscanner API
- Google Flights API (QPX Express)
- Custom flight data sources

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

Apache-2.0 License

## Author

Dinerpordin

## Acknowledgments

- Inspired by top flight booking platforms (Skyscanner, Kayak, Momondo)
- AI recommendations powered by advanced language models
- Built with modern web technologies
