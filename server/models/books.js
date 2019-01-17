const mongoose = require('mongoose')
const Users = require('./users')

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    isbn: {
        type: String,
        required: true,
        unique: true
    },
    subtitle:String,
    author: String,
    published: String,
    pages:  Number,
    description:  String,
    website:  String
})
const Book = module.exports = mongoose.model('book', booksSchema)

module.exports.getBooks = (user) => {
    return new Promise((resolve) =>{
        Users.find({
            userName:user
        }).then((data)=>{
            return data
        }).then(()=>{
            return Book.find({})
        }).then(data =>{
            resolve(data) 
        })
    })
}

module.exports.getBookbyId = (bookId) => {
    return new Promise((resolve,reject) =>{
        Book.findById(bookId).then(data =>{
            resolve(data) 
        }).catch((err) => {
            reject(err)
        })
    })
}
