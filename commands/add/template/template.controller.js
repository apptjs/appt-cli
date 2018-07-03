const requireFiles = require('require-files');
const templatePrompt = require('./template.prompt');

const boilerplatePaths = requireFiles.get(`boilerplates/**/schema.json`);
const boilerplates = boilerplatePaths.map(boilerplate => {
      const src = boilerplate.split('/');
      
      src.pop();
      
      return Object.assign({
            src: src.join('/')
      }, require(boilerplate))
});

const make = templateName => {
      console.log("\nThis utility will walk you through adding an Appt boilerplate.\nPress ^C at any time to quit.\n");
      
      return chooseTemplate(templateName)
            .then(() => templatePrompt.setOption())
            .then(() => templatePrompt.setPrefixName())            
            .then(() => templatePrompt.setGroups())
            .then((groups) => console.log(JSON.stringify(groups, null, 4)));
}

const chooseTemplate = name => {
      if(name && name != ''){
            const template = boilerplates.find(choice => choice.name.toLowerCase() === name.toLowerCase());
                  
            if(!template){
                  return templatePrompt
                        .askForName(name)
                              .then(() => templatePrompt.setName(boilerplates))
                              .catch(() => process.exit(0));
            }

            return new Promise(resolve => {                  
                  templatePrompt.boilerplate = template;

                  resolve(template)
            });

      } else {
            if(boilerplates.length === 1){
                  return new Promise(resolve => resolve(boilerplates[0]));
            }
            
            return templatePrompt
                  .setName(boilerplates)
                        .catch(() => process.exit(0))
      }      
}

module.exports = {   
      make
}