const { inquirer, ora, chalk } = require('schemium-api').essentials;
const path = require('path');
const file = require('fs');
const config = require('../../../config')
const clear = require('clear');
const Case = require('case');

class TemplatePrompt {
      constructor(){
            this.boilerplate = {};
            this.option = {};
            this.groups = [];
            this.classes = [];
      }
      
      setName(choices){            
            return inquirer.prompt({
                  type: 'list',
                  message: 'What boilerplate do you want to use?',
                  name: 'name',
                  choices: choices
            })
            .then(res => {
                  this.boilerplate = choices
                        .find(choice => res.name === choice.name)
                  
                  return this.boilerplate;
            });
      }

      setOption(){
            return inquirer.prompt({
                  type: 'list',
                  message: 'What option do you want to use?',
                  name: 'name',
                  choices: this.boilerplate.options
            })
            .then(res => {
                  this.option = this.boilerplate.options
                        .find(choice => res.name === choice.name)
                  
                  return this.option;
            });
      }

      setGroups(){
            return this.chooseOptionalGroups()
                  .then(() => this.promptGroup());
      }

      chooseOptionalGroups(){
            const choices = this.option.groups
                  .filter(group => group.optional && group.optional === true);
            
            if(choices.length > 1){
                  return inquirer.prompt({
                        type: 'checkbox',
                        message: 'Do you want add the following classes groups?',
                        name: 'name',
                        choices: choices
                  })
                  .then(chosenGroups => {
                        const requireds = this.option.groups
                              .filter(group => !group.optional)
                        
                        this.groups = requireds
                              .concat(this.option.groups
                                    .filter(group => chosenGroups.name
                                          .some(chosen => chosen === group.name)));
                        
                        return this.groups;
                  });
            } else {
                  this.groups = this.option.groups;
                  
                  return this.groups;
            }
      }

      promptGroup(index = 0){
            if(this.groups.length > index){                  
                  clear();
                  
                  console.log('');

                  const group = this.groups[index];
                  const groupDest = group.dest || ""
                  const groupPath = this.option.prefix && group.prefix_on.some(prefix => prefix === "dest")
                        ? groupDest + "/" + this.option.prefix_name 
                        : groupDest;

                  return inquirer.prompt({
                        type: 'input',
                        name: 'dest',
                        message: `Choose the path for ${group.name} classes:`,
                        default: process.cwd() + '/' + groupPath + '/',
                        filter: dir => {
                              if(dir[0] === '/'){
                                    let arrPath = dir.trim().split('/');

                                    arrPath.shift();
                                    
                                    return arrPath.join('/')
                              } else {
                                    return path.resolve(process.cwd() + "/" + groupPath, dir);
                              }
                        }
                  })
                  .then(path => {
                        group.new_dest = "";
                        group.new_dest = path.dest;
                        group.classes = [];

                        console.log();

                        return this.promptGroupClasses(group);
                  })
                  .then(() => {
                        console.log();

                        return inquirer.prompt({
                              type: 'confirm',
                              name: 'continue',
                              message: `Is this ok to you?`,
                              default: true
                        })
                        .then(confirm => {
                              if(!confirm.continue) {
                                    group.classes = [];

                                    return this.promptGroup(index);
                              }
                              
                              return this.promptGroup(++index)
                        })
                  })
            } else {
                  return this.groups;
            }
      }     

      promptGroupClasses(group, index = 0){
            const _this = this;            

            const from = path.resolve(this.boilerplate.src, group.src[index].replace('.js') + '.js');            

            const groupName = this.option.prefix ? this.option.prefix_name : group.new_dest.split('/').pop();            
            const className = this.option.prefix && group.prefix_on.some(prefix => prefix === "name")
                  ? this.option.prefix_name 
                  : groupName;

            return new Promise(resolve => {
                  file.readFile(from, 'utf8', function(oErr, content) {
                        group.classes.push({
                              original: Object.assign({
                                    src: from,
                                    decorator: _this.getDecoratorData(content, config.regex.decorator, from)
                              }, _this.getClassData(content, config.regex.class, from))
                        });

                        resolve();
                  });
            })
            .then(() => {
                  return inquirer.prompt({
                        type: 'input',
                        name: 'name',
                        message: `Choose a name for ${group.classes[index].original.name} class:`,
                        default: Case.pascal(className) + Case.pascal(group.classes[index].original.name)
                  })
            })
            .then(resClass => {
                  return inquirer.prompt({
                        type: 'input',
                        name: 'name',
                        message: `Choose a filename for ${resClass.name} class:`,
                        default: Case.lower(resClass.name, '.').replace('.js', '') + '.js',
                        filter: name => name.replace('.js', '') + '.js'
                  })
                  .then(resFile => Object.assign(group.classes[index], {
                        new: {
                              class: resClass.name,
                              file: resFile.name
                        }
                  }))
            })
            .then(res => {                  
                  if(group.src.length > parseInt(index + 1)){
                        console.log();

                        return this.promptGroupClasses(group, ++index)
                  }                  

                  return group;
            });
      }

      setPrefixName(){
            return new Promise(resolve => {
                  if(!this.option.prefix){
                        resolve();
                  } else {
                        return inquirer.prompt({
                              type: 'input',
                              name: 'name',
                              message: `Choose a prefix name for your group classes:`,
                              filter: name => Case.lower(name, '_')
                        })
                        .then(prefix => {
                              this.option.prefix_name = prefix.name;

                              resolve();
                        })
                  }
            })
      }

      getClassData(content, regex, from){
            const foundName = content.match(regex.name);
            const foundArgs = content.match(regex.args);
            
            const classData = {
                  name: "",
                  args: []
            }

            if(foundName && foundName.length > 1) {
                  classData.name = foundName[1].trim();
            } else {
                  console.log(`class name was not found for ${from}`)                  
            }

            if(foundArgs) {
                  classData.args = foundArgs[1]
                        .replace(new RegExp(' ', 'g'), '')
                              .trim().split(',');
            }

            return classData;
      }

      getDecoratorData(content, regex, from){
            const found = content.match(regex);
            
            if(!found) return;

            return {
                  type: found[1].replace('@', '').toLowerCase(),
                  args: found[3] || {}
            };
      }

      askForName(name){
            return inquirer.prompt({
                        type: 'confirm',
                        name: 'continue',
                        message: `Template ${name} was not found. Do you want to see your boilerplates list?`,
                        default: true
                  })
                  .then(res => {
                        if(!res.continue)
                              throw new Error('');

                        return;
                  })
      }
}

module.exports = new TemplatePrompt();