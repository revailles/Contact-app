const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const session = require('express-session')
const cookieParser = require('cookie-parser')
const flash = require('connect-flash')
const { body, validationResult, check} = require('express-validator')
const methodOverride = require('method-override')

require('./utility/db')
const Contact = require('./model/contact')

const app = express()
const port = 3000

//Setup Method Override
app.use(methodOverride('_method'))

//Flash Configuration
app.use(cookieParser('secret'))
app.use(session({
    cookie: { maxAge: 6000 },
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}))
app.use(flash())

//Setup EJS
app.set('view engine', 'ejs')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))

//Home
app.get('/', (req, res) => {
    res.render('index', { layout: 'layouts/main-layout', title: 'Home' })
})

//About
app.get('/about', (req, res) => {
    res.render('about', {
        layout: 'layouts/main-layout',
        title: 'About'
    })
})

//Contact
app.get('/contact', async (req, res) => {
    const contacts = await Contact.find()
    res.render('contact', {
        layout: 'layouts/main-layout',
        title: 'Contact',
        contacts,
        msg: req.flash('msg')
    })
})

//Add Contact
app.get('/contact/add', (req, res) => {
    res.render('add-contact', {
        layout: 'layouts/main-layout',
        title: 'Add Contact',
    })
})

//Add Contact Process
app.post('/contact', [
    body('name').custom(async (value) => {
        const duplicate = await Contact.findOne({ name: value })
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
       Contact.insertMany(req.body, (error, result) => {
           req.flash('msg', 'Contact has been saved')
           res.redirect('/contact')
       })
    }
})

//Delete Contact
app.delete('./contact', (req, res) => {
    Contact.deleteOne({ name: req.body.name }).then((result) => {
        req.flash('msg', 'Contact has been Deleted')
        res.redirect('/contact')
    })
})

//Edit Data Contact
app.get('/contact/edit/:name', async  (req, res) => {
    const contact = await Contact.findOne({ name: req.params.name })
    res.render('edit-contact', {
        layout: 'layouts/main-layout',
        title: 'Update Contact',
        contact
    })
})

//Change data process
app.put('/contact/update', [
    body('name').custom(async (value, { req }) => {
        const duplicate = await Contact.findOne({name: value})
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
        Contact.updateOne({
            _id : req.body._id
        },
        {
            $set: { 
                name: req.body.name,
                phone: req.body.phone,
                email: req.body.email
            }
        }
        )/then((result) => {
            req.flash('msg', 'Contact has been updated')
            res.redirect('/contact')
        })
    }
})

//Contact Detail
app.get('/contact/:name', async (req, res) => {
    const contact = await Contact.findOne({ name : req.params.name })
    res.render('detail', {
        layout: 'layouts/main-layout',
        title: 'Detail Contact',
        contact
    })
})

app.listen(port, () => {
    console.log(`Listening add port ${port}`)
})