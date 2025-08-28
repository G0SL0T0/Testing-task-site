import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';

const app = express();
const port = 3000;

app.use(express.json());

app.post('/api/scrape', (req: Request, res: Response) => {
  const { url, keyword } = req.body;
  
  if (!url || !keyword) {
    return res.status(400).json({ error: 'URL and keyword are required' });
  }
  
  const scraperPath = path.join(__dirname, '../dist/scraper.js');
  const command = `node ${scraperPath} --url "${url}" --keyword "${keyword}"`;
  
  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: 'Scraping failed' });
    }
    
    res.json({ 
      success: true, 
      message: 'Scraping completed successfully!',
      siteUrl: '/site/index.html'
    });
  });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});