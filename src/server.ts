import express, { Request, Response } from 'express';
import { exec } from 'child_process';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post('/api/scrape', (req: Request, res: Response) => {
  try {
    const { url, keyword } = req.body;
    
    if (!url || !keyword) {
      return res.status(400).json({ error: 'URL and keyword are required' });
    }
    
    console.log(`Received scrape request: URL=${url}, Keyword=${keyword}`);
    
    const scraperPath = path.join(__dirname, '../dist/scraper.js');
    const command = `node ${scraperPath} --url "${url}" --keyword "${keyword}"`;
    
    console.log(`Executing command: ${command}`);
    
    exec(command, { timeout: 60000 }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Execution error: ${error}`);
        return res.status(500).json({ 
          error: 'Scraping failed',
          details: stderr || error.message 
        });
      }
      
      console.log(`Scraper output: ${stdout}`);
      
      if (stderr) {
        console.error(`Scraper stderr: ${stderr}`);
      }
      
      const targetDir = '/usr/share/nginx/html/site';
      const fs = require('fs');
      if (fs.existsSync(targetDir)) {
        const files = fs.readdirSync(targetDir);
        console.log(`Files in target directory: ${files.join(', ')}`);
      }
      
      res.json({ 
        success: true, 
        message: 'Scraping completed successfully!',
        siteUrl: '/site/index.html'
      });
    });
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});