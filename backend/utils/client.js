import { PrismaClient } from "@prisma/client";
import ImageKit from 'imagekit';

export const prisma = new PrismaClient();

// Add this debug log to verify environment variables
console.log('ImageKit Config:', {
  publicKey: !!process.env.IMG_K_PRK,
  privateKey: !!process.env.IMG_K_PUK,
  urlEndpoint: !!process.env.IMG_K_BEU
});

// Check if ImageKit environment variables are set
const hasImageKitConfig = process.env.IMG_K_PRK && process.env.IMG_K_PUK && process.env.IMG_K_BEU;

export const imageKit = hasImageKitConfig ? new ImageKit({
    publicKey: process.env.IMG_K_PRK,
    privateKey: process.env.IMG_K_PUK,
    urlEndpoint: process.env.IMG_K_BEU
}) : null;

if (!hasImageKitConfig) {
    console.warn('ImageKit environment variables are not set. Image uploads will use placeholder URLs.');
}