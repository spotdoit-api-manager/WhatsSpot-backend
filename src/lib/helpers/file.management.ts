import fs from 'fs';

export class FileManagement{
    public async deleteFile(filePath:string){
      return new Promise((resolve)=>{

        try{
          fs.unlink(`${filePath}`,()=>{
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