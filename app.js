const contacts = require('./contacts')
const yargs = require('yargs')

yargs.command({
    command: 'add',
    describe: 'Add new contact',
    builder: {
        name : {
            describe: 'Full name',
            demandOption: true,
            type: 'string'
        },
        email : {
            describe: 'Email address',
            demandOption: false,
            type: 'string'
        },
        phone : {
            describe: 'Phone number',
            demandOption: true,
            type: 'string'
        }
    },
    hadler(argv) {
        contacts.saveContact(argv.name, argv.email, argv.phone)
    }
}).demandCommand()

yargs.command({
    command : 'list',
    describe: 'Show all name, email, and phone number',
    handler() {
        contacts.listContact()
    }
})

yargs.command({
    command : 'detail',
    describe: 'Show contact(s) detail',
    builder: {
        name : {
            describe: 'Full name',
            demandOption: true,
            type: 'string'
        }},
    handler(argv) {
        contacts.detailContact(argv.name)
    }
})

yargs.command({
    command : 'delete',
    describe: 'Delete Contact',
    builder: {
        name : {
            describe: 'Full name',
            demandOption: true,
            type: 'string'
        }},
    handler(argv) {
        contacts.deleteContact(argv.name)
    }
})


yargs.parse()