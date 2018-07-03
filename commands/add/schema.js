const controller = require('./controller');

require('schemium-api')
    .command({
        name: 'add',
        abbrev: 'a',
        main: controller.add,
        description : "Adds a boilerplate",
        options : [{
            name: 'template',
            abbrev: 't',
            type : String,
            description : "Adds from template"
        }, {
            name: 'module',
            abbrev: 'm',
            type : String,
            description : "Adds Appt module"
        }, {
            name: 'component',
            abbrev: 'c',
            type : String,
            description : "Adds Appt component"
        }, {
            name: 'extender',
            abbrev: 'e',
            type : String,
            description : "Adds Appt extender type"
        }]
    });
