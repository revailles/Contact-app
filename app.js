const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const { loadContact, findContact, addContact, checkDuplicate, deleteContact, updateContact } = require('./utility/contacts')
const { body, validationResult, check } = require('express-validator')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')

const app = express()
const port = 3000

app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

app.get('/', (req, res) => {
    res.render('index', { layout: 'layouts/main-layout', title: 'Home' })
})

app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About'
    })
})

app.get('/contact', (req, res) => {
    const contacts = loadContact()
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts,
        msg: req.flash('msg')
    })
})

app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Add Contact',
    })
})

app.post('/contact', [
    body('name').custom((value) => {
        const duplicate = checkDuplicate(value)
        if (duplicate) {
            throw new Error('Name is not available!')
        }
        return true
    }),
    check('email', 'Invalid Email!').isEmail(),
    check('phone', 'Invalid number!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('add-contact', {
            title: 'Add Contact Form',
            layout: 'layouts/main-layout',
            errors: errors.array()
        })
    } else {
        addContact(req.body)
        req.flash('msg', 'Contact has been saved')
        res.redirect('/contact')
    }
})

app.get('/contact/delete/:name', (req, res) => {
    const contact = findContact(req.params.name)
    if (!contact) {
        res.status(404)
        res.send('404')
    } else {
        deleteContact(req.params.name)
        req.flash('msg', 'Contact has been deleted')
        res.redirect('/contact')
    }
})

app.get('/contact/edit/:name', (req, res) => {
    const contact = findContact(req.params.name)
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Update Contact',
        contact
    })
})

app.post('/contact/update', [
    body('name').custom((value, { req }) => {
        const duplicate = checkDuplicate(value)
        if (value !== req.body.oldName && duplicate) {
            throw new Error('Name is not available!')
        }
        return true
    }),
    check('email', 'Invalid Email!').isEmail(),
    check('phone', 'Invalid number!').isMobilePhone('id-ID')
], (req, res) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        res.render('edit-contact', {
            title: 'Edit Contact Form',
            layout: 'layouts/main-layout',
            errors: errors.array(),
            contact: req.body
        })
    } else {
        updateContact(req.body)
        req.flash('msg', 'Contact has been updated')
        res.redirect('/contact')
    }
})

app.get('/contact/:name', (req, res) => {
    const contact = findContact(req.params.name)
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Detail Contact',
        contact
    })
})

app.use('/', (req, res) => {
    res.status(404)
    res.send('404')
})

app.listen(port, () => {
    console.log("Listening add port 3000")
})