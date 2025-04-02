import { PrismaClient } from "@prisma/client";
import ImageKit from 'imagekit';

export const prisma = new PrismaClient();

export const imageKit = new ImageKit({
    publicKey: process.env.IMG_K_PRK,
    privateKey: process.env.IMG_K_PUK,
    urlEndpoint: process.env.IMG_K_BEU
});