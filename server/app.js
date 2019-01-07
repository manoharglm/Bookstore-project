const express = require('express')
const mongoose = require('mongoose')
let Books = require('./models/books')
let Users = require('./models/users')
let path = require('path')
const app = express()
const bodyParser = require('body-parser')

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost/books_project_manohar', {
    useNewUrlParser: true
})
//index page
app.get('/', (req, res) => {
    res.send('Hello append "/books" at the end of url')
})
//Display books
app.get('/books', (req, res) => {
    Books.getBooks((err, books) => {
        if (err) throw err
        res.json(books)
    })
})
//add new user
app.post('/books', (req, res) => {
    let data = req.body
    Users.addUser(data.userName, (result, stat) => {
        res.status(stat).send(result)
    })
})
//display the book of selected id
app.get('/books/:_id', (req, res) => {
    Books.getBookbyId(req.params._id, (err, book) => {
        if (err) throw err
        res.send(book)
    })
})
//display the books belong to the section want-to-read, read, reading
app.get('/api/list/:section', (req, res) => {
    Users.displayBooks(req.get('Referer'), req.params.section, (result, stat) => {
        res.status(stat).send(result)
    })
})
//add books to chosen section
app.post('/api/list/:section', (req, res) => {
    let obj=req.body
    Users.addBook(req.get('Referer'), obj.isbn, req.params.section, (result,stat) => {
        res.status(stat).send(result)
    })
})
//delete book from chosen section
app.delete('/api/list/:section/:isbn', (req, res) => {
    Users.deleteBook(req.get('Referer'), req.params.isbn, req.params.section, (result, stat) => {
        res.status(stat).send(result)
    })
})
app.use(express.static(path.join(__dirname, '../client')))
app.listen(3000)

