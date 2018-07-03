import { Component } from "@appt/core";
import { TModel, MongooseParse } from "@appt/mongoose";

@Component({
   extend: {
      type: TModel,
      use: 'Schema'
   }
})
export class Model {
   
   static getAll(){
      return this.find({});
   }

   static getById(_id){
      return this.find({ 
         _id: MongooseParse.ObjectId(_id) 
      });
   }

   static create(body){
      return this.create(body);
   }

   static update(body){      
      return this.update({ 
         _id: MongooseParse.ObjectId(body._id)
      }, { 
         $set: body 
      });
   }

   static remove(_id){
      return this.remove({ 
         _id: MongooseParse.ObjectId(_id) 
      });
   }
}