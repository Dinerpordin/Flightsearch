'use client';

import { useState } from 'react';

export default function Home() {
  const [tripType, setTripType] = useState('return');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departDate, setDepartDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [cabinClass, setCabinClass] = useState('economy');
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
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch flights');
      }

      if (data.flights && data.flights.length > 0) {
        setResults(data.flights);
        setAiRecommendation(
          `Based on your ${tripType} search for ${passengers} passenger(s) from ${from.toUpperCase()} to ${to.toUpperCase()}, we found ${data.flights.length} flights. The best value option is ${data.flights[0].airline} at ${data.meta?.currency || '$'}${data.flights[0].price}.`
        );
      } else {
        setResults([]);
        setError('No flights found for your search criteria. Try different dates or airports.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(err instanceof Error ? err.message : 'Failed to search flights. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
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
              onClick={() => setTripType('multi')}
              className={`px-6 py-2 rounded-lg font-medium transition duration-200 ${
                tripType === 'multi'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Multi-city
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                placeholder="LHR"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                maxLength={3}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                placeholder="JFK"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase"
                maxLength={3}
              />
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
            {tripType === 'return' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Return</label>
                <input
                  type="date"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Passengers</label>
              <select
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(num => (
                  <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
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
          </div>
          
          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Searching Real-Time Flights...' : 'Search Flights'}
          </button>

          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
              {error}
            </div>
          )}
        </div>

        {aiRecommendation && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <span className="text-3xl">🤖</span>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
                <p className="text-purple-100">{aiRecommendation}</p>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Flights ({results.length})</h2>
            {results.map((flight) => (
              <div key={flight.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
                    <p className="text-gray-600 mt-1">{flight.from} → {flight.to}</p>
                    <div className="flex gap-4 mt-2">
                      <p className="text-sm text-gray-500">🕐 {flight.departureTime} - {flight.arrivalTime}</p>
                      <p className="text-sm text-gray-500">⏱️ {flight.duration}</p>
                      <p className="text-sm text-gray-500">✈️ {flight.stops === 0 ? 'Direct' : `${flight.stops} stop(s)`}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">{flight.currency || '$'}{flight.price}</p>
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
        )}
      </div>
    </main>
  );
}
