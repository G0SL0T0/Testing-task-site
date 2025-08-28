import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join, basename, dirname } from "path";
import axios from "axios";

export function injectKeyword(text: string, kw: string): string {
  const words = text.split(" ");
  const idx = Math.floor(Math.random() * (words.length + 1));
  words.splice(idx, 0, kw);
  return words.join(" ");
}

export async function downloadAsset(url: string, dir: string): Promise<string> {
  try {
    const fileName = basename(new URL(url).pathname) || "asset";
    const localPath = join(dir, fileName);
    
    const fileDir = dirname(localPath);
    if (!existsSync(fileDir)) {
      mkdirSync(fileDir, { recursive: true });
    }
    
    console.log(`Downloading asset: ${url} to ${localPath}`);
    const { data } = await axios.get(url, { 
      responseType: "arraybuffer",
      timeout: 5000,
    });
    writeFileSync(localPath, Buffer.from(data));
    console.log(`Successfully downloaded: ${localPath}`);
    return fileName;
  } catch (error) {
    console.error(`Error downloading asset ${url}:`, error);
    throw error;
  }
}