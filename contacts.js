const fs = require('fs');
const chalk = require('chalk');
const validator = require('validator')

const dirPath = './data'
if(!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const dataPath = './data/contacts.json'
if(!fs.existsSync(dataPath)) { 
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContact = () => {
    const filebuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON .parse(filebuffer)
    return contacts
}

const saveContact = () => {
    const contact = { name, email, phone }
    const contacts = loadContact()

     const duplicate = contacts.find((contact) => contact.name === name)
     if(duplicate) {
         console.log(chalk.red.inverse.bold('Name has already been taken, please choose another name'))
         return false
     }

     if(email) {
         if(!validator.isEmail(email)){
              console.log(chalk.red.inverse.bold('Please enter a valid email address!'))
              return false
         }
     }

    if(!validator.isMobilePhone(phone, 'id-ID')){
        console.log(chalk.red.inverse.bold('Please enter a valid phone number!'))
        return false
    }
 
     constacts.push(contact)
 
     fs.writeFileSync('data/contacts.json', JSON.stringify(constacts))
 
     console.log(chalk.green.inverse.bold('Thankyou'))

}

const listContact = () => {
    const contacts = loadContact()
     console.log(chalk.blue.inverse.bold('Contact List'))
    contacts.forEach((contact, i) => {
        console.log(`${i + 1}. ${contact.name} - ${contact.phone}`)
    })
}

const contactDetail = (name) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase())
    if(!contact) {
        console.log(chalk.red.inverse.bold(`${name} is not found`))
        return false
    }
    console.log(chalk.cyan.inverse.bold(contact.name))
    console.log(contact.phone)
    if(contact.email) {
        console.log(contact.email)
    }
}

const deleteContact = (name) => {
    const contacts = loadContact()
    const newContacts = contacts.filter((contact) => {
        contact.name.toLowerCase() !== name.toLowerCase()
    })

    if(contacts.length === newContacts.length) {
        console.log(chalk.red.inverse.bold(`${name} is not found`))
        return false
    }
    fs.writeFileSync('data/contacts.json', JSON.stringify(newConstacts))
 
    console.log(chalk.green.inverse.bold(`${name} has been deleted`))

}

module.exports = { saveContact, listContact, contactDetail, deleteContact }