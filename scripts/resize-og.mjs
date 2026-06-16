import sharp from "sharp";
import { readFileSync } from "fs";

const input = "public/images/og.png";
const output = "public/images/og.png";
const width = 1200;
const height = 630;
// Match marketing dark shell
const background = { r: 15, g: 23, b: 42, alpha: 1 };

const buffer = await sharp(readFileSync(input))
  .resize(width, height, { fit: "contain", background })
  .png({ compressionLevel: 9 })
  .toBuffer();

await sharp(buffer).toFile(output);

const meta = await sharp(output).metadata();
console.log(`Written ${output} at ${meta.width}x${meta.height}`);
