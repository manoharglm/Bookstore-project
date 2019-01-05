const express = require('express')
const mongoose = require('mongoose')
let Books = require('./models/books')
let Users = require('./models/users')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/books_project_manohar', {
    useNewUrlParser: true
})

app.get('/', (req, res) => {
    res.send('Hello append "/books" at the end of url')
})

app.get('/books', (req, res) => {
    Books.getBooks((err, books) => {
        if (err) throw err
        res.json(books)
    })
})

app.post('/books', (req, res) => {
    let data = req.body
    Users.addUser(data.userName, (err, user) => {
        if (err) throw err
        res.json(user)
    })
})

app.get('/books/:_id', (req, res) => {
    Books.getBookbyId(req.params._id, (err, book) => {
        if (err) throw err
        res.send(book)
    })
})

app.get('/api/list/:section', (req, res) => {
    Users.displayBooks(req.get('Referer'), req.params.section, (err, books) => {
        if (err) throw err
        res.send(books)
    })
})

app.post('/api/list/:section', (req, res) => {
    let obj=req.body
    Users.addBook(req.get('Referer'), obj.isbn, req.params.section, (result) => {
        if (result) {
            res.status(400).send('Book already exists')
        }else{
            res.status(201).send(`Book is added to ${req.params.section} books section`)
        }
    })
})
app.delete('/api/list/:section/:isbn', (req, res) => {
    Users.deleteBook(req.get('Referer'), req.params.isbn, req.params.section, (err, books) => {
        if (err) throw err
        res.send(books)
    })
})
app.listen(3000)