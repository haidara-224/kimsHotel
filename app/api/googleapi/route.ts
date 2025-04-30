// app/api/googleapi/route.ts
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const { searchParams } = new URL(req.url);
  const input = searchParams.get("input");

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!apiKey) {
    return new Response(JSON.stringify({ error: "API key is missing." }), {
      status: 500,
    });
  }

  try {
    const apiResponse = await fetch(
      `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&components=country:gn&key=${apiKey}`
    );

    if (!apiResponse.ok) {
      return new Response(
        JSON.stringify({ error: "Failed to fetch data from Google Maps API." }),
        { status: apiResponse.status }
      );
    }

    const data = await apiResponse.json();
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(
      JSON.stringify({ error: "An unexpected error occurred." }),
      { status: 500 }
    );
  }
};
