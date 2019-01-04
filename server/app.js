const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let Books = require('./models/books.js')
let Users = require('./models/users.js')

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

// app.post('/books', (req, res) => {
//     let userName = req.body
//     Books.addUserName(userName, (err, user) => {
//         if (err) throw err
//         res.json(user)
//     })
// })
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
    let obj = req.body
    Users.addBook(req.get('Referer'), obj.isbn,req.params.section, (err, books) => {
        if (err) throw err
        res.send(books)
    })
})
app.delete('/api/list/:section/:isbn', (req, res) => {
    Users.deleteBook(req.get('Referer'), req.params.isbn,req.params.section, (err, books) => {
        if (err) throw err
        res.send(books)
    })
})
app.listen(3000)
// app.use(express.static(path.join(__dirname, '../client')))

