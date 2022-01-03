import { HTTP200Error } from './../utils/httpErrors';

import { EventEmitter } from 'events';
import { sendQrCode, sendQrRetryExceed, sendConnectionClosed, sendError } from './socket';

export const eventEmitter = new EventEmitter();


export const initateEventListners = ()=>{

        console.log("initateed listners...");
        
    eventEmitter.on('connection_update',(data)=>{
        console.log("connection update ",data);
        // sendQrCode(data.phone,data.qr);
    });
   
    eventEmitter.on('qr_update',(data)=>{
        console.log("received qr data ",data);
        sendQrCode(data.phone,data.qr);
    });
    eventEmitter.on("qr_exceeded",(phone:string)=>{
        sendQrRetryExceed(phone);
    });

    eventEmitter.on('new_client',(data)=>{
        console.log("received new client data ",data);
    })

    eventEmitter.on("connection_closed",(data:any)=>{
        sendConnectionClosed(data);
    });

    eventEmitter.on("error",(data:any)=>{
        sendError(data);
    });
    
}
