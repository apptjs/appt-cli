const templateController = require('./template/template.controller');
const moduleController = require('./module.controller');
const componentController = require('./component.controller');

module.exports.add = options => {      
      if(Object.keys(options).find(opt => opt === 'template')){
            return templateController.make(options.template);
      } else if(Object.keys(options).find(opt => opt === 'module')){
            return moduleController.make(options.module, options.extender);
      } else if(Object.keys(options).find(opt => opt === 'component')){
            return componentController.make(options.component, options.extender);
      }
}