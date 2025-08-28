import React, { useState } from 'react';
import axios from 'axios';

interface ScraperFormProps {
  onScrapeComplete: (result: {
    success: boolean;
    message: string;
    siteUrl?: string;
  }) => void;
}

const ScraperForm: React.FC<ScraperFormProps> = ({ onScrapeComplete }) => {
  const [url, setUrl] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, keyword }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        onScrapeComplete({
          success: true,
          message: data.message,
          siteUrl: data.siteUrl
        });
        setUrl('');
        setKeyword('');
      } else {
        setError(data.error || 'Scraping failed');
        onScrapeComplete({
          success: false,
          message: data.error || 'Scraping failed'
        });
      }
    } catch (err) {
      setError('Failed to scrape the site. Please try again.');
      onScrapeComplete({
        success: false,
        message: 'Scraping failed'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="url">Website URL</label>
        <input
          type="url"
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          required
          disabled={isLoading}
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="keyword">Keyword</label>
        <input
          type="text"
          id="keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter keyword to inject"
          required
          disabled={isLoading}
        />
      </div>
      
      <button type="submit" disabled={isLoading}>
        {isLoading && <span className="loading"></span>}
        {isLoading ? 'Scraping...' : 'Start Scraping'}
      </button>
      
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default ScraperForm;