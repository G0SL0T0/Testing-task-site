import React from 'react';

interface ResultsDisplayProps {
  results: {
    success: boolean;
    message: string;
    siteUrl?: string;
  };
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  return (
    <div className={results.success ? 'success' : 'error'}>
      <p>{results.message}</p>
      {results.success && results.siteUrl && (
        <a 
          href={results.siteUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="result-link"
        >
          View Scraped Site
        </a>
      )}
    </div>
  );
};

export default ResultsDisplay;