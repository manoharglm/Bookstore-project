const express = require('express')
const mongoose = require('mongoose')
const app = express()
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.json())

let Books = require('./models/index.js')
mongoose.connect('mongodb://localhost/books_project_manohar', {
    useNewUrlParser: true
})

// let db = mongoose.connection

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

app.post('/list/want-to-read', (req, res) => {
    /*Books.wantToRead(req.referrer, (err, books) => {
        if (err) throw err
        res.send(books)
    })*/
    console.log(req.referrer);
    Books.find({userName:req.referrer},(err,data)=>{
        res.send(data)
      })
})


app.get('/books/:_id', (req, res) => {
    Books.getBookbyId(req.params._id, (err, book) => {
        if (err) throw err
        res.send(book)
    })
})




app.listen(3000)
// app.use(express.static(path.join(__dirname, '../client')))