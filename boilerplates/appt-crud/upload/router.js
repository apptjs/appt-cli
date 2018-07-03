import { Component } from "@appt/core";
import { TRouter } from "@appt/api";

import multer from "multer";

var upload = multer({ dest: 'uploads/' })

@Component({
   extend: {
      type: TRouter,
      config: {
         path: '/v1'
      }
   },
   inject: 'Controller'
})
export class Router {
   constructor(controller){
      this.controller = controller;
   }

   @Get('/')
   getAll(req, res){
      this.controller
         .getAll()
            .then(data => res.status(200).send(data))
            .catch(ex => res.status(500).send(ex))
   }

   @Get('/:_id')
   getById(req, res){
      this.controller
         .getById(req.params._id)
            .then(data => res.status(200).send(data))
            .catch(ex => res.status(500).send(ex))
   }

   @Post('/upload', upload.single('file'))
   create(req, res){
      this.controller
         .create(req.body)
            .then(data => res.status(200).send(data))
            .catch(ex => res.status(500).send(ex))
   }

   @Post('/')
   create(req, res){
      this.controller
         .create(req.body)
            .then(data => res.status(200).send(data))
            .catch(ex => res.status(500).send(ex))
   }

   @Put('/')
   update(req, res){
      this.controller
         .update(req.body)
            .then(data => res.status(200).send(data))
   }

   @Delete('/:_id')
   remove(req, res){
      this.controller
         .remove(req.params._id)
            .then(data => res.status(200).send(data))
   }
}