import { PrismaClient } from "@prisma/client";
import ImageKit from 'imagekit';

export const prisma = new PrismaClient();
// Add this debug log to verify environment variables
console.log('ImageKit Config:', {
  publicKey: !!process.env.IMG_K_PRK,
  privateKey: !!process.env.IMG_K_PUK,
  urlEndpoint: !!process.env.IMG_K_BEU
});
export const imageKit = new ImageKit({
    publicKey: process.env.IMG_K_PRK,
    privateKey: process.env.IMG_K_PUK,
    urlEndpoint: process.env.IMG_K_BEU
});