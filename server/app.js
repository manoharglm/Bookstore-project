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
        username: req.get('Referer')
    }, joiSchema)
    if (validation.error === null) {
        next()
    } else res.send(`Invalid username ${req.get('Referer')}`)
})

//index page
app.get('/', (req, res) => {
    res.send('Hello append "/api/books" at the end of url')
})
//Display books
app.get('/api/books', (req, res) => {
    Books.getBooks().then(data =>{
        res.json(data)
    }) 
})
//display the book of selected id
app.get('/api/books/:_id', (req, res) => {
    Books.getBookbyId(req.params._id).then(data => {
        res.send(data)
    }).catch((err) =>{
        res.send(err.message)
    })
})
//validate and add new user
app.post('/api/register', (req, res) => {
    let user = req.body
    Users.validateUser(user.userName).then(
        Users.addUser(user.userName).then(result => {
            res.status(201).send(result)
        })
    ).catch(err => {
        res.status(400).send(err)
    })
})

//display the books belong to the section want-to-read, read, reading
app.get('/api/list/:section', (req, res) => {
    Users.displayBooks(req.get('Referer'), req.params.section).then(data =>{
        res.status(201).send(data)
    }).catch((err) =>{
        res.status(400).send(err)
    })
})
//add books to chosen section
app.post('/api/list/:section', (req, res) => {
    let obj = req.body
    if (!Users.joiValidationIsbn(obj.isbn)){
        Users.validatingRequest(req.get('Referer'), obj.isbn)
            .then((data) =>{
                return data
            }).then(data => {
                if(!data){
                    Users.addBook(req.get('Referer'), obj.isbn, req.params.section).then(books =>{
                        res.send(books)
                    }).catch((err) => res.send(err))
                }else{
                    res.send('Book already exists')
                }
            }).catch(err => {
                res.send(err)
            })
    }else res.status(400).send('Invalid request')

})
//delete book from chosen section
app.delete('/api/list/:section/:isbn', (req, res) => {
    Users.deleteBook(req.get('Referer'), req.params.isbn, req.params.section).then(data => {
        res.status(200).send(data)
    }).catch(err => res.send(err))
})
app.use(express.static(path.join(__dirname, '../client')))
app.listen(3000)
