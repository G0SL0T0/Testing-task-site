import { writeFileSync, mkdirSync } from "fs";
import { join, basename, dirname } from "path";
import axios from "axios";

export function injectKeyword(text: string, kw: string): string {
  const words = text.split(" ");
  const idx = Math.floor(Math.random() * (words.length + 1));
  words.splice(idx, 0, kw);
  return words.join(" ");
}

export async function downloadAsset(url: string, dir: string): Promise<string> {
  const fileName = basename(new URL(url).pathname) || "asset";
  const localPath = join(dir, fileName);
  mkdirSync(dirname(localPath), { recursive: true });
  const { data } = await axios.get(url, { responseType: "arraybuffer" });
  writeFileSync(localPath, Buffer.from(data));
  return fileName;
}