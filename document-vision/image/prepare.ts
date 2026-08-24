import sharp from "sharp";
import { visionConfig } from "../config";
import type { PreparedImage } from "../types";

export async function prepareImageForApi(input: Buffer): Promise<PreparedImage> {
  const pipeline = sharp(input)
    .rotate()
    .resize({
      width: visionConfig.maxImageSidePx,
      height: visionConfig.maxImageSidePx,
      fit: "inside",
      withoutEnlargement: true,
    })
    .jpeg({ quality: visionConfig.jpegQuality });

  const buffer = await pipeline.toBuffer();
  const metadata = await sharp(buffer).metadata();

  return {
    buffer,
    mimeType: "image/jpeg",
    width: metadata.width ?? 0,
    height: metadata.height ?? 0,
  };
}
