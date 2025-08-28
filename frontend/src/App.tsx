import React, { useState } from 'react';
import ScraperForm from './components/ScraperForm';
import ResultsDisplay from './components/ResultsDisplay';

function App() {
  const [results, setResults] = useState<{
    success: boolean;
    message: string;
    siteUrl?: string;
  } | null>(null);

  const handleScrapeComplete = (result: {
    success: boolean;
    message: string;
    siteUrl?: string;
  }) => {
    setResults(result);
  };

  return (
    <div className="container">
      <div className="card">
        <h1>Site Scraper</h1>
        <p>Enter a URL and keyword to scrape and modify the content</p>
        
        <ScraperForm onScrapeComplete={handleScrapeComplete} />
        
        {results && <ResultsDisplay results={results} />}
      </div>
    </div>
  );
}

export default App;