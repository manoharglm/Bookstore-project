const mongoose = require('mongoose')

const booksSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    isbn: {
        type : Number,
        required: true,
        unique: true
    },
    subtitle: {
        type: String,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    published: {
        type: String,
        required: true
    },
    pages: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    website: {
        type: String,
        required: true
    }

})
const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    want_to_read: {
        type: Array,
        required: true
    },
    read: {
        type: Array,
        required: true
    },
    reading: {
        type: Array,
        required: true
    }

})

const Book = module.exports = mongoose.model('book', booksSchema)
const user = module.exports = mongoose.model('user',userSchema)


module.exports.getBooks = (callback) => {
    Book.find(callback)
}

module.exports.getBookbyId = (bookId, callback) => {
    Book.findById(bookId, callback)
}

// module.exports.addUserName = (userName, callback) => {
//     user.create(userName, callback)
// }

module.exports.wantToRead =(user)=>{
    console.log(user);
 user.find({userName:user},(err,data)=>{
   return data;
 })
}
