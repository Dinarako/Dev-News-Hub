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
  
  let url = `https://api.currentsapi.services/v1/search?keywords=${encodeURIComponent(
    keywords || 'technology'
  )}&language=en&apiKey=${API_KEY}`;
  
  if (start_date) {
    url += `&start_date=${start_date}`;
  }
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ 
      status: 'error',
      message: error.message || 'Failed to fetch news' 
    });
  }
}
