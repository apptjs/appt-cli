import { Component } from "@appt/core";

@Component({
   inject: 'Model'
})
export class Controller {
   constructor(model){
      this.model = model;
   }

   getAll(){
      return this.model.getAll();
   }

   getById(_id){
      return this.model.getById(_id);
   }

   create(body){
      return this.model.create(body);
   }

   update(body){
      return this.model.update(body);
   }

   remove(_id){
      return this.model.remove(_id);
   }
}