import { Component } from "@appt/core";
import { TSchema } from "@appt/mongoose";

@Component({
   extend: {
      type: TSchema
   }
})
export class Schema {}