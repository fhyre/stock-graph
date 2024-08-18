export const getStock = async (symbol: string) => {
  try {
    const res = await fetch(
      `https://api.polygon.io/v2/aggs/ticker/${symbol}/range/1/minute/2000-01-01/2024-01-01?adjusted=true&sort=asc&apiKey=${process.env.POLYGON_API_KEY}`,
      { cache: "force-cache" },
    );

    if (!res.ok) {
      throw new Error("Failed to fetch data");
    }

    const data = await res.json();
    return data;
  } catch (error) {
    throw error;
  }
};
