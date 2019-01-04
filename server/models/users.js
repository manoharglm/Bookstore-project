const mongoose = require('mongoose')
let Book = require('./books.js')

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    want_to_read: [],
    read: [],
    reading: []

})
const User = module.exports = mongoose.model('user', userSchema)

module.exports.wantToRead = (user, callback) => {
    User.findOne({
        userName: user
    }, 'want_to_read', callback)
}
module.exports.addToWantToRead = (user, bookIsbn, callback) => {
    Book.find({
        isbn: bookIsbn
    }, (err, data) => {
        if (err) throw err
        User.findOneAndUpdate({
            userName: user
        }, {
            $push: {
                want_to_read: {
                    title: data[0].title,
                    isbn: data[0].isbn
                }
            }
        }, callback)
    })
}
module.exports.deleteFromWantToRead = (user, bookIsbn, callback) => {


    User.findOneAndUpdate({
        userName: user
    }, {
        $pull: {
            want_to_read: {
                isbn: bookIsbn
            }
        }
    }, {
        multi: true
    }, (err, data) => {
        console.log(data)
    })
    // let query ={userName: user}
    // User.find(query, {select:{want_to_read:{isbn:bookIsbn}}} ,(err, data) => {
    //     console.log(data)
    // })
    // User.findOneAndDelete(query)
}

// module.exports.addUserName = (userName, callback) => {
//     user.create(userName, callback)
// }


// User.insertMany(
//     [{
//         'userName': 'rocky',
//         'password': 'yoadrian',
//         'want_to_read': [{
//             'isbn': '9781449337711',
//             'title': 'Designing Evolvable Web APIs with ASP.NET'
//         }],
//         'read': [{
//             'isbn': '9781449325862',
//             'title': 'Git Pocket Guide'
//         }],
//         'reading': [{
//             'isbn': '9781491950296',
//             'title': 'Programming JavaScript Applications'
//         }]
//     },
//     {
//         'userName': 'adrian',
//         'password': 'rocky',
//         'want_to_read': [{
//             'isbn': '9781593277574',
//             'title': 'Understanding ECMAScript 6'
//         }],
//         'read': [{
//             'isbn': '9781491950296',
//             'title': 'Programming JavaScript Applications'
//         }],
//         'reading': [{
//             'isbn': '9781449365035',
//             'title': 'Speaking JavaScript'
//         }]
//     }]
// )