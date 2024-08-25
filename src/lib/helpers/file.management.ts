import fs from "fs";
import path from "path";

export class FileManagement{
    public async deleteFile(filePath: string){
      return new Promise((resolve)=>{
        console.log("delete path ",filePath);
        
        try{
          fs.unlink(filePath,()=>{
            resolve({error:false});
          });
        }catch(e){
          console.log("error in deleting file ",e);
         resolve({error:true,message:e.message});
        }
      });
    }

    public async deleteFolder(filePath: string) {
      return new Promise((resolve) => {
        console.log("delete path ", filePath);
    
        try {
          fs.rmdir(filePath, { recursive: true }, (err) => {
            if (err) {
              console.log("error in deleting folder", err);
              resolve({ error: true, message: err.message });
            } else {
              resolve({ error: false });
            }
          });
        } catch (e) {
          console.log("error in deleting folder ", e);
          resolve({ error: true, message: e.message });
        }
      });
    }
}

export default new FileManagement();