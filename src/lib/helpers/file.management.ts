import fs from "fs";
import path from "path";

export class FileManagement{
    public async deleteFile(filePath: string):Promise<{error:boolean,message?:string}>{
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

    public async deleteFolder(folderPath: string):Promise<{error:boolean,message?:string}>{
        return new Promise((resolve)=>{
          try{
            fs.rmdir(folderPath,{recursive:true},()=>{
              resolve({error:false});
            });

          }catch(e){
            console.log("error in deleting folder ",e);
           resolve({error:true,message:e.message});
          }
        });
    }

    public async isFilePresent(filePath: string):Promise<boolean>{
        return  fs.existsSync(filePath);
    }
}

export default new FileManagement();