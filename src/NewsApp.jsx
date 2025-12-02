import { useState } from "react";
import logo from "./logo.png";

const API_KEY = process.env.REACT_APP_CURRENTS_API_KEY;

if (!API_KEY) {
  console.error("Missing REACT_APP_CURRENTS_API_KEY in .env");
}

const TOPICS = [
  { value: "", label: "All Tech" },

  
  { value: "javascript", label: "JavaScript" },
  { value: "python", label: "Python" },
  { value: "typescript", label: "TypeScript" },
  { value: "c++", label: "C++" },
  { value: "c#", label: "C#" },
  { value: "java programming", label: "Java" },
  { value: "go language", label: "Go (Golang)" },
  { value: "rust language", label: "Rust" },

  { value: "react", label: "React" },
  { value: "nextjs", label: "Next.js" },
  { value: "vuejs", label: "Vue.js" },
  { value: "svelte", label: "Svelte" },

  
  { value: "nodejs", label: "Node.js" },
  { value: "backend development", label: "Backend Dev" },
  { value: "devops", label: "DevOps" },
  { value: "docker OR kubernetes", label: "Docker / Kubernetes" },
  { value: "cloud computing OR aws OR gcp OR azure", label: "Cloud" },

  
  { value: "cybersecurity", label: "Cyber Security" },
  { value: "penetration testing", label: "Pen Testing" },
  { value: "network security", label: "Network Security" },

 
  { value: "ai OR machine learning", label: "AI / Machine Learning" },
  { value: "deep learning", label: "Deep Learning" },
  { value: "data science", label: "Data Science" },
  { value: "neural networks", label: "Neural Networks" },


  { value: "web development", label: "Web Development" },
  { value: "mobile development", label: "Mobile Dev" },
  { value: "startup technology", label: "Startups" },
];

function highlightText(text, term) {
  if (!term) return text;

  
  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escaped})`, "gi");
  const parts = text.split(regex);

  return parts.map((part, index) => {
    
    if (part.toLowerCase() === term.toLowerCase()) {
      return (
        <span key={index} className="highlight">
          {part}
        </span>
      );
    }
    return <span key={index}>{part}</span>;
  });
}

function NewsApp() {
  const [searchTerm, setSearchTerm] = useState("");
  const [topic, setTopic] = useState(TOPICS[0].value);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [recentOnly, setRecentOnly] = useState(false);


  const handleSearch = async (e) => {
    e?.preventDefault();

    // Build a combined query from topic + search term
    const parts = [topic, searchTerm].filter(Boolean);
    const query = parts.length ? parts.join(" ") : "technology";

    setLoading(true);
    setError("");
    setArticles([]);

    try {
      // 1) Use backend proxy API route (works on Vercel, not localhost)
      let url = `/api/news?keywords=${encodeURIComponent(query)}`;

      // 2) Note: Date filtering removed due to Currents API free tier limitations
      // The "Last 3 days" filter will be applied client-side instead
      if (recentOnly) {
        // Client-side filtering will be applied after fetching
      }

      console.log("Request URL:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("API Response:", data);
      console.log("Response status:", res.status);
      console.log("News array:", data.news);

      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch news: ${res.status}`);
      }

      if (data.status === "error" || data.status === "400") {
        throw new Error(data.msg || data.message || "API error");
      }

      // Currents API returns 'news' array instead of 'articles'
      let filteredArticles = data.news || [];

      console.log("Filtered articles count:", filteredArticles.length);

      // Map Currents API response to match our existing structure
      filteredArticles = filteredArticles.map(article => ({
        title: article.title,
        description: article.description,
        url: article.url,
        urlToImage: article.image || article.urlToImage,
        publishedAt: article.published,
        author: article.author,
        source: { name: article.author || "Unknown" }
      }));

      if (recentOnly) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 3);

        filteredArticles = filteredArticles.filter((article) => {
          if (!article.publishedAt) return false;
          return new Date(article.publishedAt) >= cutoff;
        });
      }

      setArticles(filteredArticles);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="news-app">
      <h1 className="app-title">
        <img src={logo} alt="Logo" className="app-logo" />
        Dev News Hub  
      </h1>
      <p className="subtitle">
        Stay up to date with tech news by topic or keyword.
      </p>

      <form className="news-controls" onSubmit={handleSearch}>
        <select
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          aria-label="Select topic"
        >
          {TOPICS.map((t) => (
            <option key={t.label} value={t.value}>
              {t.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Search keyword (e.g. Next.js, OpenAI)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <button type="submit">Search</button>
          <label className="recent-toggle">
    <input
      type="checkbox"
      checked={recentOnly}
      onChange={(e) => setRecentOnly(e.target.checked)}
    />
    Last 3 days
  </label>
      </form>

      <div className="news-status">
        {loading && <p>Loading articles...</p>}
        {error && <p className="error">{error}</p>}

        {!loading && !error && articles.length > 0 && (
  <p className="articles-found">
    Found {articles.length} articles 
    {recentOnly && (
      <span className="filter-badge">Last 3 days</span>
    )}
  </p>
)}


        {!loading && !error && articles.length === 0 && (
          <p>No articles found. Try another keyword.</p>
        )}
      </div>

      <ul className="news-list">
        {articles.map((article) => (
          <li key={article.url} className="news-item">
            {article.urlToImage && (
  <img
    src={article.urlToImage}
    alt={article.title}
    className="news-image"
  />
)}

            <h2>
              <a href={article.url} target="_blank" rel="noreferrer">
                {highlightText(article.title, searchTerm)}
              </a>
            </h2>

            <p className="news-meta">
              {article.source?.name} •{" "}
              {article.author ? `${article.author} • ` : ""}
              {article.publishedAt
                ? new Date(article.publishedAt).toLocaleString()
                : ""}
            </p>

            {article.description && (
              <p className="news-description">
                {highlightText(article.description, searchTerm)}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsApp;
