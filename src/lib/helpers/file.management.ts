import fs from 'fs';
import path from 'path';

export class FileManagement{
    public async deleteFile(filePath:string){
      return new Promise((resolve)=>{
        console.log("delete path ",path.join(__dirname, filePath));
        
        try{
          fs.unlink(path.join(__dirname, filePath),()=>{
            resolve({error:false})
          });
        }catch(e){
          console.log("error in deleting file ",e);
         resolve({error:true,message:e.message})
        }
      })
    }
}

export default new FileManagement();