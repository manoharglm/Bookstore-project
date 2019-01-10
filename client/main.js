// // document.addEventListener("DOMContentLoaded", function () {
//     async function onclickGetBooks() {
//         await getUserDataBySection("want_to_read")
//         await getUserDataBySection("read")
//         await getUserDataBySection("reading")
//     }

//     function getUserDataBySection(section) {
//         let username = document.getElementById('login-input').value
//         fetch(`/api/list/${section}`, {
//                 method: "GET",
//                 headers: {
//                     "Content-Type": "application/json",
//                     "referrer": username,
//                 },
//             })
//             .then(response => response.json()).then((data) => {
//                 let arr = []
//                 data[0][section].forEach(element => {
//                     arr.push(element.isbn)
//                 })
//                 getBooks().then((data) => {
//                     fetchTitleAndImage(data, arr, section)
//                 })
//             })
//     }

//     function fetchTitleAndImage(data, booksArr, section) {
//         $('.bookstore-section-books').append(`<h3>${section}</h3>`)
//         for (let i = 0; i < data.length; i++) {
//             if (booksArr.includes(data[i].isbn)) {
//                 $('.bookstore-section-books').append(`<div class="bookstore-${section}-section"><img src="${data[i].cover}"><p>${data[i].title}</p></div>`)
//             }
//         }
//     }

//     function getBooks() {
//         return new Promise((resolve, reject) => {
//             fetch('/api/books', {
//                     method: 'GET'
//                 }).then((response) => {
//                     return response.json()
//                 })
//                 .then(data => {
//                     data.forEach(element => {
//                         $('.bookstore-books').append(`<div><img src="${element.cover}"><p>${element.title}</p></div>`)
//                     });
//                     resolve(data)
//                 })
//         })
//     }
// // })



// // fetch(`/api/register`, {
// //     method: "POST",
// //     headers: {
// //         "Content-Type": "application/json",
// //     },
// // })
// // .then(response => response.json()).then((data) => {
// //     let arr = []
// //     data[0][section].forEach(element => {
// //         arr.push(element.isbn)
// //     })
// //     getBooks().then((data) => {
// //         fetchTitleAndImage(data, arr, section)
// //     })
// // })


fetch(`/api/register`, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()).then(data => console.log(data))