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
  
  const API_KEY = process.env.REACT_APP_NEWS_API_KEY || '40b73fbe07f843f7a4102b8990726f2e';
  
  // NewsAPI /everything endpoint - supports keyword search and date filtering
  // Note: Free tier limits to 100 results per request
  let url = `https://newsapi.org/v2/everything?language=en&pageSize=100&apiKey=${API_KEY}`;
  
  if (keywords) {
    url += `&q=${encodeURIComponent(keywords)}`;
  }
  
  // NewsAPI supports date filtering
  if (start_date) {
    url += `&from=${start_date}`;
  }
  
  try {
    console.log('Fetching from NewsAPI:', url);
    const response = await fetch(url);
    const data = await response.json();
    console.log('NewsAPI Response:', data);
    
    res.status(200).json(data);
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      status: 'error',
      message: error.message || 'Failed to fetch news' 
    });
  }
}
// Updated Mon, Dec  1, 2025  9:11:48 PM
