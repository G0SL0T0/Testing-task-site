import { useState } from "react";

export default function App() {
  const [url, setUrl] = useState("");
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");

  const scrape = async () => {
    setStatus("scraping…");
    await fetch("/api/scrape", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url, keyword }),
    });
    setStatus("done! open /site");
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Site Scraper</h1>
      <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="URL" />
      <input value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="Keyword" />
      <button onClick={scrape}>Scrape</button>
      <p>{status}</p>
    </div>
  );
}