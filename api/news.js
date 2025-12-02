// Vercel Serverless Function to proxy Currents API requests
export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { keywords, start_date } = req.query;
  
  const API_KEY = process.env.REACT_APP_CURRENTS_API_KEY || '9Bk2gU1sJ6G8sv-a-oeFRiapKRJxlT2mKFG-z47PwlK-btcx';
  
  // Use latest-news endpoint instead of search for better compatibility
  // Note: Currents API free tier limits to 200 results per request
  let url = `https://api.currentsapi.services/v1/latest-news?language=en&page_size=200&apiKey=${API_KEY}`;
  
  if (keywords) {
    url += `&keywords=${encodeURIComponent(keywords)}`;
  }
  
  // Note: Currents API free tier doesn't support date filtering
  // Remove start_date to avoid 400 errors
  // if (start_date) {
  //   url += `&start_date=${start_date}`;
  // }
  
  try {
    console.log('Fetching from Currents API:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('Currents API Response:', data);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message || 'Failed to fetch news' 
    });
  }
}
