import { imageKit } from "./client.js";

export const iUploader = async (file,i)=>{
    try {
        // If ImageKit is not configured, return placeholder URLs
        if (!imageKit) {
            console.log("ImageKit not configured, using placeholder URLs");
            return [`https://via.placeholder.com/400x300?text=Image+${i+1}`, `placeholder-${i}`];
        }
        
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
    } catch (error) {
        console.error("ImageKit upload failed:", error.message);
        // Return a placeholder URL for now
        return [`https://via.placeholder.com/400x300?text=Image+${i+1}`, `placeholder-${i}`];
    }
}