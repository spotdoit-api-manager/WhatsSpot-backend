import fs from 'fs';

export class FileManagement{
    public async deleteFile(filePath:string){
            try{
              fs.unlinkSync(filePath);
              return {error:false}
            }catch(e){
                console.log("error in deleting file ",e);
                return {error:true,message:e.message}
            }
    }
}

export default new FileManagement();