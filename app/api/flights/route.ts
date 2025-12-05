import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { from, to, departDate, returnDate, passengers, cabinClass, tripType } = body;

    // Validate required fields
    if (!from || !to || !departDate) {
      return NextResponse.json(
        { error: 'Missing required fields: from, to, departDate' },
        { status: 400 }
      );
    }

    // Get Amadeus access token
    const tokenResponse = await fetch('https://test.api.amadeus.com/v1/security/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: process.env.AMADEUS_API_KEY || '',
        client_secret: process.env.AMADEUS_API_SECRET || '',
      }),
    });

    if (!tokenResponse.ok) {
      console.error('Failed to get Amadeus token');
      return NextResponse.json(
        { error: 'Failed to authenticate with flight API' },
        { status: 500 }
      );
    }

    const { access_token } = await tokenResponse.json();

    // Search for flights
    const searchParams = new URLSearchParams({
      originLocationCode: from.toUpperCase(),
      destinationLocationCode: to.toUpperCase(),
      departureDate: departDate,
      adults: passengers?.toString() || '1',
      travelClass: cabinClass?.toUpperCase() || 'ECONOMY',
      nonStop: 'false',
      max: '10',
    });

    if (returnDate && tripType === 'return') {
      searchParams.append('returnDate', returnDate);
    }

    const flightResponse = await fetch(
      `https://test.api.amadeus.com/v2/shopping/flight-offers?${searchParams}`,
      {
        headers: {
          'Authorization': `Bearer ${access_token}`,
        },
      }
    );

    if (!flightResponse.ok) {
      const errorData = await flightResponse.json();
      console.error('Flight API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch flights', details: errorData },
        { status: flightResponse.status }
      );
    }

    const flightData = await flightResponse.json();

    // Transform Amadeus data to our format
    const transformedFlights = flightData.data?.slice(0, 10).map((offer: any, index: number) => {
      const firstSegment = offer.itineraries[0].segments[0];
      const lastSegment = offer.itineraries[0].segments[offer.itineraries[0].segments.length - 1];
      const duration = offer.itineraries[0].duration.replace('PT', '').toLowerCase();
      
      return {
        id: index + 1,
        airline: firstSegment.carrierCode,
        from: firstSegment.departure.iataCode,
        to: lastSegment.arrival.iataCode,
        date: departDate,
        price: parseFloat(offer.price.total),
        currency: offer.price.currency,
        duration: duration,
        stops: offer.itineraries[0].segments.length - 1,
        departureTime: new Date(firstSegment.departure.at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        arrivalTime: new Date(lastSegment.arrival.at).toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false
        }),
        bookingUrl: `https://www.google.com/travel/flights?q=flights+from+${from}+to+${to}+on+${departDate}`,
        segments: offer.itineraries[0].segments.length,
        validatingAirlineCodes: offer.validatingAirlineCodes,
      };
    }) || [];

    return NextResponse.json({
      success: true,
      flights: transformedFlights,
      meta: {
        count: transformedFlights.length,
        currency: flightData.data?.[0]?.price?.currency || 'USD',
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
