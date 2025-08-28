#!/usr/bin/env node
import { Command } from "commander";
import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync, existsSync, readdirSync } from "fs";
import { join } from "path";
import { downloadAsset, injectKeyword } from "./utils.js";

// Функция для замены example.com на IP-адрес
function resolveUrl(url: string): string {
  if (url.includes('example.com')) {
    return url.replace('example.com', '93.184.216.34');
  }
  return url;
}

const program = new Command();
program
  .requiredOption("--url <url>")
  .requiredOption("--keyword <keyword>");
program.parse();

const { url, keyword } = program.opts<{
  url: string;
  keyword: string;
}>();

const TARGET_DIR = "/usr/share/nginx/html/site";

async function main() {
  console.log(`Starting scraping for URL: ${url}`);
  console.log(`Target directory: ${TARGET_DIR}`);
  
  // Проверяем и создаем директорию
  if (!existsSync(TARGET_DIR)) {
    console.log(`Creating directory: ${TARGET_DIR}`);
    mkdirSync(TARGET_DIR, { recursive: true });
  }

  try {
    // Резолвим URL
    const resolvedUrl = resolveUrl(url);
    console.log(`Downloading HTML from: ${resolvedUrl}`);
    
    const { data: html } = await axios.get(resolvedUrl, {
      headers: { "User-Agent": "Mozilla/5.0 (site-scraper)" },
      timeout: 10000,
    });
    console.log(`Downloaded HTML, length: ${html.length} characters`);
    
    const $ = cheerio.load(html);

    // Модификация заголовков
    console.log("Modifying headers (title, h1)");
    let modifiedHeaders = 0;
    $("title, h1").each((_, el) => {
      const $el = $(el);
      const originalText = $el.text();
      const modifiedText = injectKeyword(originalText, keyword);
      $el.text(modifiedText);
      modifiedHeaders++;
      console.log(`Modified header: "${originalText}" -> "${modifiedText}"`);
    });
    console.log(`Modified ${modifiedHeaders} headers`);

    // Модификация текстовых блоков
    console.log("Modifying text blocks (p, span, li, div)");
    let modifiedBlocks = 0;
    $("p, span, li, div").each((_, el) => {
      if (Math.random() < 0.2) { // 20% вероятность
        const $el = $(el);
        const originalText = $el.text();
        if (originalText.trim()) { // Только если есть текст
          const modifiedText = injectKeyword(originalText, keyword);
          $el.text(modifiedText);
          modifiedBlocks++;
          console.log(`Modified block: "${originalText.substring(0, 50)}..." -> "${modifiedText.substring(0, 50)}..."`);
        }
      }
    });
    console.log(`Modified ${modifiedBlocks} text blocks`);

    // Обработка ресурсов
    console.log("Processing external assets");
    const assets: Array<{ el: any; attr: string; src: string }> = [];
    $("link[rel='stylesheet'], script[src], img[src]").each((_, el) => {
      const tagEl = el as any;
      const attr = tagEl.tagName === "link" ? "href" : "src";
      const src = $(el).attr(attr);
      if (src && src.startsWith("http")) {
        assets.push({ el, attr, src });
      }
    });
    console.log(`Found ${assets.length} external assets`);

    // Скачивание ресурсов
    let downloadedAssets = 0;
    for (const { el, attr, src } of assets) {
      try {
        // Резолвим URL ресурса
        const resolvedSrc = resolveUrl(src);
        const local = await downloadAsset(resolvedSrc, TARGET_DIR);
        $(el).attr(attr, local);
        downloadedAssets++;
        console.log(`Downloaded asset: ${resolvedSrc} -> ${local}`);
      } catch (error) {
        console.error(`Failed to download asset: ${src}`, error);
      }
    }
    console.log(`Successfully downloaded ${downloadedAssets} assets`);

    // Сохранение результата
    const indexPath = join(TARGET_DIR, "index.html");
    writeFileSync(indexPath, $.html(), "utf8");
    console.log(`Saved HTML to: ${indexPath}`);
    
    // Проверяем содержимое директории
    console.log(`Contents of ${TARGET_DIR}:`);
    const files = readdirSync(TARGET_DIR);
    files.forEach(file => {
      console.log(` - ${file}`);
    });
    
    console.log("Scraping completed successfully!");
  } catch (error) {
    console.error("Scraping failed:", error);
    throw error;
  }
}

main().catch(console.error);