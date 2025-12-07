'use client';

import { useState } from 'react';

// Major International Airports
const AIRPORTS = [
  { code: 'JFK', name: 'John F. Kennedy International Airport', city: 'New York', country: 'USA' },
  { code: 'LHR', name: 'London Heathrow', city: 'London', country: 'UK' },
  { code: 'CDG', name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France' },
  { code: 'DXB', name: 'Dubai International Airport', city: 'Dubai', country: 'UAE' },
  { code: 'HND', name: 'Tokyo Haneda Airport', city: 'Tokyo', country: 'Japan' },
  { code: 'LAX', name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'USA' },
  { code: 'SIN', name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore' },
  { code: 'HKG', name: 'Hong Kong International Airport', city: 'Hong Kong', country: 'Hong Kong' },
  { code: 'AMS', name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands' },
  { code: 'FRA', name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany' },
  { code: 'ICN', name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea' },
  { code: 'SYD', name: 'Sydney Airport', city: 'Sydney', country: 'Australia' },
  { code: 'BKK', name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand' },
  { code: 'IST', name: 'Istanbul Airport', city: 'Istanbul', country: 'Turkey' },
  { code: 'DOH', name: 'Hamad International Airport', city: 'Doha', country: 'Qatar' },
  { code: 'ORD', name: "O'Hare International Airport", city: 'Chicago', country: 'USA' },
  { code: 'MAD', name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain' },
  { code: 'BCN', name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain' },
  { code: 'MUC', name: 'Munich Airport', city: 'Munich', country: 'Germany' },
  { code: 'FCO', name: 'Leonardo da Vinci-Fiumicino Airport', city: 'Rome', country: 'Italy' },
];

// Supported Currencies
const CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'British Pound' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar' },
];

export default function Home() {
  const [tripType, setTripType] = useState('return');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
  const [currency, setCurrency] = useState('USD');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState('');
  const [error, setError] = useState('');

  const searchFlights = async () => {
    if (!from || !to || !departDate) {
      alert('Please fill all required fields');
      return;
    }

    if (tripType === 'return' && !returnDate) {
      alert('Please select return date');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/flights', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from,
          to,
          departDate,
          returnDate,
          passengers,
          cabinClass,
          tripType,
          currency,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setResults(data.flights);
        generateAiRecommendation(data.flights);
      } else {
        setError(data.error || 'Failed to fetch flights');
      }
    } catch (err) {
      setError('An error occurred while searching for flights');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const generateAiRecommendation = (flights: any[]) => {
    if (flights.length === 0) return;

    const cheapest = flights[0];
    const fastest = flights.reduce((prev, curr) => 
      parseInt(prev.duration) < parseInt(curr.duration) ? prev : curr
    );
    const direct = flights.find(f => f.stops === 0);

    let recommendation = `Based on your search:\n`;
    recommendation += `• Best Value: ${cheapest.airline} - ${CURRENCIES.find(c => c.code === currency)?.symbol}${cheapest.price.toFixed(2)} (${cheapest.stops === 0 ? 'Direct' : `${cheapest.stops} stop(s)`})\n`;
    if (fastest.id !== cheapest.id) {
      recommendation += `• Fastest: ${fastest.airline} - ${fastest.duration}\n`;
    }
    if (direct && direct.id !== cheapest.id) {
      recommendation += `• Direct Flight: ${direct.airline} - ${CURRENCIES.find(c => c.code === currency)?.symbol}${direct.price.toFixed(2)}\n`;
    }

    setAiRecommendation(recommendation);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">✈️ AI Flight Search</h1>
          <p className="text-xl text-gray-600">Find the best flights with AI-powered recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setTripType('return')}
              className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${
                tripType === 'return'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Return
            </button>
            <button
              onClick={() => setTripType('oneway')}
              className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${
                tripType === 'oneway'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              One-way
            </button>
            <button
              onClick={() => setTripType('multi-city')}
              className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${
                tripType === 'multi-city'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Multi-city
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <select
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase max-length-3"
              >
                <option value="">Select Origin</option>
                {AIRPORTS.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city}, {airport.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <select
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase max-length-3"
              >
                <option value="">Select Destination</option>
                {AIRPORTS.map(airport => (
                  <option key={airport.code} value={airport.code}>
                    {airport.code} - {airport.city}, {airport.country}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Depart</label>
              <input
                type="date"
                value={departDate}
                onChange={(e) => setDepartDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
              <input
                type="date"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
                disabled={tripType !== 'return'}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(parseInt(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>{num} Passenger{num > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Cabin Class</label>
              <select
                value={cabinClass}
                onChange={(e) => setCabinClass(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First Class</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {CURRENCIES.map(curr => (
                  <option key={curr.code} value={curr.code}>
                    {curr.code} ({curr.symbol}) - {curr.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Searching Real-Time Flights...' : 'Search Flights'}
          </button>

          {error && (
            <div className="mt-6 p-4 bg-red-100 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {aiRecommendation && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl shadow-lg p-6 mb-8 border-l-4 border-blue-600">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">🤖 AI Recommendations</h2>
            <pre className="whitespace-pre-wrap text-gray-700 font-medium">{aiRecommendation}</pre>
          </div>
        )}

        {results.length > 0 && (
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Available Flights ({results.length})</h2>
            <div className="space-y-4">
              {results.map((flight) => (
                <div key={flight.id} className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-200 p-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
                    <div>
                      <p className="text-2xl font-bold text-blue-600">{flight.airline}</p>
                      <p className="text-sm text-gray-500">Flight {flight.id}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{flight.from}</p>
                      <p className="text-sm text-gray-500">{flight.departureTime}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-sm text-gray-500">✈️ {flight.duration}</p>
                      <p className="text-sm text-gray-500">✈️ {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</p>
                    </div>

                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{flight.to}</p>
                      <p className="text-sm text-gray-500">{flight.arrivalTime}</p>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">📅 {flight.departureTime} - {flight.arrivalTime}</p>
                      <p className="text-sm text-gray-500">🕒 {flight.duration}</p>
                      <p className="text-sm text-gray-500">✈️ {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">{CURRENCIES.find(c => c.code === currency)?.symbol}{flight.price}</p>
                      <p className="text-xs text-gray-500 mb-2">per person</p>
                      <a
                        href={flight.bookingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200"
                      >
                        Book Now
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
