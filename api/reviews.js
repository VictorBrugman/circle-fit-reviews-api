export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_KEY;

  // ✅ Voeg hier je locaties toe (eenvoudig uitbreidbaar)
  const placeIds = {
    leiden: "ChIJsz_tCDPHxUcRFnwNK7gSwrc",
    almelo: "ChIJ2xHuQjsGuEcRDv_DWji68EY",
  };

  const results = [];

  try {
    for (const [city, id] of Object.entries(placeIds)) {
      const url = `https://places.googleapis.com/v1/places/${id}?fields=displayName,rating,reviews&key=${apiKey}`;
      const response = await fetch(url, {
        headers: {
          "X-Goog-Api-Key": apiKey,
          "X-Goog-FieldMask": "displayName,rating,reviews",
        },
      });
      const data = await response.json();

      if (data && (data.reviews || data.rating)) {
        results.push({
          city,
          name: data.displayName?.text || "Onbekend",
          rating: data.rating || "N/A",
          reviews: data.reviews || [],
        });
      } else {
        console.warn(`Geen data gevonden voor ${city}`, data);
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fout bij ophalen van Google reviews" });
  }
}
