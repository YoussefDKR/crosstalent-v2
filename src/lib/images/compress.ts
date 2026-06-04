import sharp from "sharp";

const AVATAR_SIZE = 400;
const LOGO_MAX = 512;

export async function compressAvatar(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(AVATAR_SIZE, AVATAR_SIZE, { fit: "cover", position: "centre" })
    .webp({ quality: 82, effort: 4 })
    .toBuffer();
}

export async function compressCompanyLogo(input: Buffer): Promise<Buffer> {
  return sharp(input)
    .rotate()
    .resize(LOGO_MAX, LOGO_MAX, {
      fit: "inside",
      withoutEnlargement: true,
    })
    .webp({ quality: 85, effort: 4 })
    .toBuffer();
}
