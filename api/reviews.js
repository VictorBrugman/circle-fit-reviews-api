export default async function handler(req, res) {
  const apiKey = process.env.GOOGLE_MAPS_KEY;

  // Voeg hier zoveel locaties toe als je wilt
  const placeIds = {
    leiden: "ChIJI4ITI8zvxkcR52ComXVmFIg",
    denbosch: "ChIJl4ITl8zvxkcR52ComXVmFIg"
  };

  const results = [];

  try {
    for (const [city, id] of Object.entries(placeIds)) {
      const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${id}&fields=name,rating,reviews&key=${apiKey}`;
      const response = await fetch(url);
      const data = await response.json();

      if (data.result) {
        results.push({
          city,
          name: data.result.name,
          rating: data.result.rating,
          reviews: data.result.reviews || []
        });
      }
    }

    res.status(200).json(results);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Google reviews" });
  }
}
