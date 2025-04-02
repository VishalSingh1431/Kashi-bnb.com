import { imageKit } from "./client.js";


export const iUploader = async (file,i)=>{
    const name = `id${Date.now().toString()}-${i}`
    const uploadImg = async () => {
      const response = await imageKit.upload({
        file: file.buffer,
        fileName: name,
        isPrivateFile: false
      });
      return response.url;
    };
    const imageUrl = await uploadImg();
    return [imageUrl,name];
}