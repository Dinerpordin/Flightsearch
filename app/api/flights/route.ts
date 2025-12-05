import { NextRequest, NextResponse } from 'next/server';

// Mock flight data generator
function generateMockFlights(from: string, to: string, departDate: string, returnDate: string | null, passengers: number, currency: string) {
  const airlines = ['BA', 'LH', 'AF', 'KL', 'EK', 'QR', 'TK', 'SQ', 'AA', 'DL'];
  const flights = [];
  
  for (let i = 0; i < 10; i++) {
    const basePrice = 200 + Math.random() * 800;
    const stops = Math.floor(Math.random() * 3);
    
    // Outbound flight
    flights.push({
      id: `OUT-${i + 1}`,
      airline: airlines[Math.floor(Math.random() * airlines.length)],
      from: from.toUpperCase(),
      to: to.toUpperCase(),
      date: departDate,
      price: parseFloat((basePrice * passengers).toFixed(2)),
      currency: currency,
      duration: `${5 + Math.floor(Math.random() * 10)}h ${Math.floor(Math.random() * 60)}m`,
      stops: stops,
      departureTime: `${String(6 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      arrivalTime: `${String(12 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
      bookingUrl: `https://www.google.com/travel/flights?q=flights+from+${from}+to+${to}+on+${departDate}`,
    });
    
    // Return flight if round-trip
    if (returnDate) {
      flights.push({
        id: `RET-${i + 1}`,
        airline: airlines[Math.floor(Math.random() * airlines.length)],
        from: to.toUpperCase(),
        to: from.toUpperCase(),
        date: returnDate,
        price: parseFloat((basePrice * passengers * 0.9).toFixed(2)),
        currency: currency,
        duration: `${5 + Math.floor(Math.random() * 10)}h ${Math.floor(Math.random() * 60)}m`,
        stops: stops,
        departureTime: `${String(14 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        arrivalTime: `${String(20 + i).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}`,
        bookingUrl: `https://www.google.com/travel/flights?q=flights+from+${to}+to+${from}+on+${returnDate}`,
      });
    }
  }
  
  return flights.sort((a, b) => a.price - b.price);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, departDate, returnDate, passengers, cabinClass, tripType, currency } = body;

    if (!from || !to || !departDate) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, departDate' },
        { status: 400 }
      );
    }

    // Generate mock flights
    const flights = generateMockFlights(
      from,
      to,
      departDate,
      tripType === 'return' ? returnDate : null,
      passengers || 1,
      currency || 'USD'
    );

    return NextResponse.json({
      success: true,
      flights,
      meta: {
        count: flights.length,
        currency: currency || 'USD',
        tripType,
      },
    });

  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}