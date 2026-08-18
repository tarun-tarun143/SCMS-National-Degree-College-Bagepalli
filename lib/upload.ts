export type UploadProvider = "local" | "cloudinary";
export const uploadProvider = (process.env.UPLOAD_PROVIDER ?? "local") as UploadProvider;

export function assertSafeUpload(fileName:string,size:number,mime:string){
 const allowed=["application/pdf","image/jpeg","image/png","image/webp","application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
 if(!allowed.includes(mime)) throw new Error("Unsupported file type.");
 if(size>10*1024*1024) throw new Error("File is larger than the 10 MB limit.");
 if(fileName.includes("..") || fileName.includes("/") || fileName.includes("\\")) throw new Error("Unsafe file name.");
}
