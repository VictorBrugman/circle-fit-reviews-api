export default async function handler(req, res) {
  const { placeId } = req.query;

  if (!placeId) {
    return res.status(400).json({ error: "Missing placeId parameter" });
  }

  const apiKey = process.env.GOOGLE_MAPS_KEY; // beveiligde sleutel
  const url = `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=name,rating,reviews&key=${apiKey}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (!data.result) {
      return res.status(404).json({ error: "No reviews found" });
    }

    res.status(200).json({
      name: data.result.name,
      rating: data.result.rating,
      reviews: data.result.reviews,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error fetching Google reviews" });
  }
}
