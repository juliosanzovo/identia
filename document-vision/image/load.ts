import { readFile } from "fs/promises";
import sharp from "sharp";
import { ImagemInvalidaError } from "../errors";
import type { DocumentVisionInput } from "../types";

export async function loadImageBuffer(
  input: DocumentVisionInput
): Promise<{ buffer: Buffer; hint: string }> {
  if ("imagePath" in input) {
    const buffer = await readFile(input.imagePath);
    const hint = input.imagePath.split(/[/\\]/).pop() ?? "documento.jpg";
    return { buffer, hint };
  }

  return {
    buffer: input.image,
    hint: input.filename ?? "documento.jpg",
  };
}

export async function assertValidImage(buffer: Buffer): Promise<void> {
  if (!buffer.length) {
    throw new ImagemInvalidaError("Arquivo de imagem vazio");
  }

  try {
    const metadata = await sharp(buffer).metadata();
    if (!metadata.width || !metadata.height) {
      throw new ImagemInvalidaError();
    }
  } catch (error) {
    if (error instanceof ImagemInvalidaError) throw error;
    throw new ImagemInvalidaError();
  }
}
