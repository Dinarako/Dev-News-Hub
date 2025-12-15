import { useState } from "react";
import logo from "./logo.png";

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

      // 2) NewsAPI supports date filtering, but we'll keep client-side for consistency
      if (recentOnly) {
       
      }

      console.log("Request URL:", url);

      const res = await fetch(url);
      const data = await res.json();

      console.log("API Response:", data);
      console.log("Response status:", res.status);
      console.log("Articles array:", data.articles);

      if (!res.ok) {
        throw new Error(data.message || `Failed to fetch news: ${res.status}`);
      }

      if (data.status === "error") {
        throw new Error(data.message || "API error");
      }

      // NewsAPI returns 'articles' array
      let filteredArticles = data.articles || [];

      console.log("Filtered articles count:", filteredArticles.length);

      console.log("Before filter - Articles count:", filteredArticles.length);
      console.log("Recent only filter enabled:", recentOnly);

      if (recentOnly) {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 3);
        console.log("Cutoff date:", cutoff.toISOString());

        const beforeFilterCount = filteredArticles.length;
        filteredArticles = filteredArticles.filter((article) => {
          if (!article.publishedAt) {
            console.log("Article without date:", article.title);
            return false;
          }
          const articleDate = new Date(article.publishedAt);
          const isRecent = articleDate >= cutoff;
          console.log(`${article.title.substring(0, 50)}... - ${article.publishedAt} - Recent: ${isRecent}`);
          return isRecent;
        });
        console.log(`After filter - Removed ${beforeFilterCount - filteredArticles.length} old articles`);
        console.log("After filter - Articles count:", filteredArticles.length);
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
          placeholder="Search keyword"
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
