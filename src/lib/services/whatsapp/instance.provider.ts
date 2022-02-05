// provider.ts
import InstanceManager from 'instance-manager';
import Whatsapp from './whatsapp.service';
 

const instanceProvider = new InstanceManager<any, any>();

// instanceProvider.addClass(Whatsapp);

export default instanceProvider;