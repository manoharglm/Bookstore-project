let books={};
// let username = document.getElementById('login-input').value
    fetch('/api/books', {
        method: 'GET'
    }).then((response) => {
        return response.json()
    }).then(data => {
        for (let i = 0; i < data.length; i++) {
            books[data[i].isbn]=data[i];
            $('.bookstore-books').append(`<div><img src="${data[i].cover}"><p>${data[i].title}</p></div>`)
        }
        // console.log(books);
        callSectionSync();
    })
    async function callSectionSync(){
        await fetchTitleAndImage('want_to_read');
        await fetchTitleAndImage('read');
        await fetchTitleAndImage('reading');
    }
    function fetchTitleAndImage(section){
       return new Promise((resolve,reject)=>{
        fetch(`/api/list/${section}`, {
            method: "GET", 
            headers: {
                "Content-Type": "application/json",
                "referrer": 'rocky',
            },
        })
        .then(response => response.json()
        ).then(data => {
            // console.log(data.length);
            for(let i=0;i<data[0][section].length;i++){
                console.log(books[data[0][section][i].isbn].isbn)
                $('.bookstore-section-books').append(`<section class='booktore-${section}-books'><img src="${books[data[0][section][i].isbn].cover}"><p>${books[data[0][section][i].isbn].title}</p></section>`)
            }
            resolve()
        })
       })
     }
// if(username.length!=null)
// getuserData()



//  function getUserDataBySection() {
//     
//    fetch(`http://localhost:3000/api/list/want_to_read`, {
//             method: "GET", 
//             headers: {
//                 "Content-Type": "application/json",
//                 "referrer": username,
//             },
//         })
//         .then(response => response.json()
//         ).then(data => {
//             let arr =data[0].want_to_read
//             let booksArr =[]
//             let k = null
//             // arr.forEach(element => {
//                 // booksArr.push(getDatabyIsbn(element.isbn))
             
//                 console.log(demoData(arr[0].isbn));
//                 // fetchTitleAndImage(getDatabyIsbn(element.isbn))

//             // })       
//                 //  Promise.all(getDatabyIsbn(element.isbn))
//             // console.log(booksArr)
//         })
//         // .then(data=>console.log(data))
// }
// async function demoData(fun){
//     let res=await getDatabyIsbn(fun);
//     return res;
// }
// function fetchTitleAndImage(booksArr){
//     console.log(booksArr)
// //     // console.log(booksArr)
// //     return new Promise((resolve,reject)=>{
// //         resolve(JSON.parse(JSON.stringify(booksArr)))
// //     }).then(data =>{
// //         console.log(data)
// //     })

//     // for (let i = 0; i < booksArr.length; i++) {
//     //     $('.bookstore-want-to-read-books').append(`<div><img src="${booksArr[i].cover}"><p>${booksArr[i].title}</p></div>`)
//     // }
// }

// function getDatabyIsbn(bookIsbn){
//    return new Promise((resolve,reject)=>{
//     fetch('http://localhost:3000/api/books', {
//         method: 'GET'
//     }).then((response) => {
//         return response.json()
//     }).then(data => {
//         for (let i = 0; i < data.length; i++) {
//             if(data[i].isbn === bookIsbn){
//                resolve(data[i])
//             //    console.log(data[i])
//             break;
//             }
//         }
//     })
//    })
        
    

// }
