'use client';

import { useState } from 'react';

export default function Home() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState('');

  const searchFlights = async () => {
    if (!from || !to || !date) {
      alert('Please fill all fields');
      return;
    }
    
    setLoading(true);
    
    // Mock flight data
    const mockFlights = [
      {
        id: 1,
        airline: 'Airways Plus',
        from, to, date,
        price: 299,
        duration: '3h 45m',
        stops: 0
      },
      {
        id: 2,
        airline: 'Sky Connect',
        from, to, date,
        price: 249,
        duration: '5h 20m',
        stops: 1
      },
      {
        id: 3,
        airline: 'Global Air',
        from, to, date,
        price: 399,
        duration: '2h 55m',
        stops: 0
      }
    ];
    
    setTimeout(() => {
      setResults(mockFlights);
      setAiRecommendation(`Based on your search for ${from} to ${to}, I recommend the Sky Connect flight at $249. While it has one stop, you'll save $50 compared to direct flights, and the layover time is minimal.`);
      setLoading(false);
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">\u2708\ufe0f AI Flight Search</h1>
          <p className="text-xl text-gray-600">Find the best flights with AI-powered recommendations</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From</label>
              <input
                type="text"
                placeholder="London (LHR)"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To</label>
              <input
                type="text"
                placeholder="New York (JFK)"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <button
            onClick={searchFlights}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-4 px-8 rounded-lg transition duration-200 disabled:bg-gray-400"
          >
            {loading ? 'Searching...' : 'Search Flights'}
          </button>
        </div>

        {aiRecommendation && (
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-xl p-6 mb-8 text-white">
            <div className="flex items-start gap-4">
              <span className="text-3xl">\ud83e\udd16</span>
              <div>
                <h3 className="text-xl font-bold mb-2">AI Recommendation</h3>
                <p className="text-purple-100">{aiRecommendation}</p>
              </div>
            </div>
          </div>
        )}

        {results.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Flights</h2>
            {results.map((flight) => (
              <div key={flight.id} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition duration-200">
                <div className="flex justify-between items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-900">{flight.airline}</h3>
                    <p className="text-gray-600 mt-1">{flight.from} \u2192 {flight.to}</p>
                    <p className="text-sm text-gray-500 mt-2">Duration: {flight.duration} | Stops: {flight.stops}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-bold text-blue-600">${flight.price}</p>
                    <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-200">
                      Select
                    </button>
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
