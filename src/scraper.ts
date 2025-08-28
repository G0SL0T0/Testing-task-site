#!/usr/bin/env node
import { Command } from "commander";
import axios from "axios";
import * as cheerio from "cheerio";
import { writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { downloadAsset, injectKeyword } from "./utils.js";

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
  const { data: html } = await axios.get(url, {
    headers: { "User-Agent": "Mozilla/5.0 (site-scraper)" },
  });
  const $ = cheerio.load(html);

  $("title, h1").each((_, el) => {
    const $el = $(el);
    $el.text(injectKeyword($el.text(), keyword));
  });

  $("p, span, li, div").each((_, el) => {
    const $el = $(el);
    const text = $el.text();
    if (Math.random() < 0.2) {
      $el.text(injectKeyword(text, keyword));
    }
  });

  const assets: Array<{ el: cheerio.Element; attr: string; src: string }> = [];
  $("link[rel=stylesheet], script[src], img[src]").each((_, el) => {
    const attr = el.tagName === "link" ? "href" : "src";
    const src = $(el).attr(attr);
    if (src && src.startsWith("http")) {
      assets.push({ el, attr, src });
    }
  });

  for (const { el, attr, src } of assets) {
    try {
      const local = await downloadAsset(src, TARGET_DIR);
      $(el).attr(attr, local);
    } catch {
      /* ignore */
    }
  }

  mkdirSync(TARGET_DIR, { recursive: true });
  writeFileSync(join(TARGET_DIR, "index.html"), $.html(), "utf8");
  console.log("✅ Scraping done.");
}

main().catch(console.error);