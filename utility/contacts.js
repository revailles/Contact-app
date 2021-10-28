const fs = require('fs');

const dirPath = './data'
if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
}

const dataPath = './data/contacts.json'
if (!fs.existsSync(dataPath)) {
    fs.writeFileSync(dataPath, '[]', 'utf-8')
}

const loadContact = () => {
    const filebuffer = fs.readFileSync('data/contacts.json', 'utf-8')
    const contacts = JSON.parse(filebuffer)
    return contacts
}

const findContact = (name) => {
    const contacts = loadContact()
    const contact = contacts.find((contact) => contact.name.toLowerCase() === name.toLowerCase())
    return contact
}

const saveContact = (contacts) => {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts))
}

const addContact = (contact) => {
    const contacts = loadContact()
    contacts.push(contact)
    saveContact(contacts)
}

const checkDuplicate = (name) => {
    const contacts = loadContact()
    return contacts.find((contact) => contact.name === name)
}

const deleteContact = (name) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.name !== name)
    saveContact(filteredContacts)
}

const updateContact = (newContact) => {
    const contacts = loadContact()
    const filteredContacts = contacts.filter((contact) => contact.name !== newContact.oldName)
    delete newContact.oldName
    filteredContacts.push(newContact)
    saveContact(filteredContacts)
}

module.exports = { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContact }