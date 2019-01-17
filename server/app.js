const express = require('express')
const mongoose = require('mongoose')
let Books = require('./models/books')
let Users = require('./models/users')
let path = require('path')
const Joi = require('joi')

const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

//Schema for joi validation
const joiSchema = Joi.object().keys({
    username: Joi.string().alphanum().min(3).max(30).required(),
    isbn: Joi.number()
})

mongoose.connect('mongodb://localhost/books_project_manohar', {
    useNewUrlParser: true
})

//Middleware function for Joi Validation
app.use('/api/list', function (req, res, next) {
    let validation = Joi.validate({
        username: req.get('Referrer')
    }, joiSchema)
    if (validation.error === null) {
        next()
    } else res.status(400).send(JSON.stringify(`Invalid username ${req.get('Referrer')}`))
})

//Display books
app.get('/api/books', (req, res) => {
    Books.getBooks(req.get('Referrer')).then(data => {
        res.status(200).json(data)
    })
})
//display the book of selected id
app.get('/api/books/:_id', (req, res) => {
    Books.getBookbyId(req.params._id).then(data => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(400).send(err.message)
    })
})
//validate and add new user
app.post('/api/register', (req, res) => {
    let user = req.body
    let validation = Joi.validate({
        username: req.body.userName
    }, joiSchema)
    if (validation.error === null) {
        Users.validateUser(user.userName).then(() => {
            return Users.addUser(user.userName)
        }).then(result => {
            res.status(201).send(result)
        }).catch((err) => {
            res.status(409).send(err)
        })
    }else{
        res.status(400).send('Invalid Username')
    }
})

//display the books belong to the section want-to-read, read, reading
app.get('/api/list/:section', (req, res) => {
    Users.displayBooks(req.get('Referrer'), req.params.section).then(data => {
        res.status(200).send(data)
    }).catch((err) => {
        res.status(400).send(err)
    })
})

//add books to chosen section
app.post('/api/list/:section', (req, res) => {
    let obj = req.body
    if (Users.joiValidationIsbn(obj.isbn).error === null) {
        Users.validatingRequest(req.get('Referrer'), obj.isbn, req.params.section)
            .then(() => {
                return Users.addBook(req.get('Referrer'), obj.isbn, req.params.section)
            })
            .then(books => {
                res.status(200).send(books)
            })
            .catch(err => {
                res.status(400).send(err)
            })
    } else res.status(400).send('Invalid request')
})
//delete book from chosen section
app.delete('/api/list/:section/:isbn', (req, res) => {
    Users.deleteBook(req.get('Referrer'), req.params.isbn, req.params.section).then(data => {
        res.status(200).send(data)
    }).catch(err => res.status(400).send(err))
})
app.use(express.static(path.join(__dirname, '../client')))
app.listen(3000)