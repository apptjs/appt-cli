import { 
   Module, 
   ApptBootstrap 
} from '@appt/core';

@Module()
export class <className> {
   constructor(){
      console.log('Appt is running!')
   }
}

ApptBootstrap.module('<className>');