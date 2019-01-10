// document.addEventListener("DOMContentLoaded", function () {
async function onclickGetBooks() {
    await getUserDataBySection("want_to_read")
    await getUserDataBySection("read")
    await getUserDataBySection("reading")
}
function displayBooks(username) {
    fetch('/api/books', {
            method: 'GET'
        }).then((response) => {
            return response.json()
        })
        .then(data => {
            data.forEach(element => {
                $('.bookstore-books').append(
                    `<div>
                            <img src="${element.cover}">
                            <p>${element.title}</p>
                            <div id="${element.isbn}" class="bookstore-section-select">
                                <button onclick='addToSection("${element.isbn}","want_to_read","${username}");' >want_to_read</button>
                                <button onclick='addToSection("${element.isbn}","read","${username}");' >Read</button>
                                <button onclick='addToSection("${element.isbn}","reading","${username}");' >Reading</button>
                            </div>
                        </div>`)
            });
        })
}

function getUserDataBySection(section) {
    let username = document.getElementById('login-input').value
    fetch(`/api/list/${section}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "referrer": username,
            },
        })
        .then(response => {
            if(section === 'want_to_read'){
                if(response.status !== 200){
                    alert('Invalid username, Please Register')
                }else{
                    displayBooks(username)
                }
            }
            return response.json()
        }).then((data) => {
            let arr = []
            data[0][section].forEach(element => {
                arr.push(element.isbn)
            })
            getBooks().then((data) => {
                fetchTitleAndImage(data, arr, section,username)
            })
        })
}

function fetchTitleAndImage(data, booksArr, section,username) {
    $('.bookstore-section-books').append(`<h3>${section}</h3>`)
    for (let i = 0; i < data.length; i++) {
        if (booksArr.includes(data[i].isbn)) {
            $('.bookstore-section-books').append(
                `<div class="bookstore-${section}-section">
                    <img src="${data[i].cover}">
                    <p>${data[i].title}</p>
                    <button onclick='deleteBookFromSection("${section}","${data[i].isbn}","${username}")' >Delete</button>
                </div>`)
        }
    }
}
function deleteBookFromSection(section,bookIsbn,username){
    let data ={
        isbn:bookIsbn
    }
    fetch(`/api/list/${section}/${bookIsbn}`, {
        method: "DELETE",
        headers: {
            "referrer": username,
        }
    })
    .then(response => response.json()).then(data => alert(` book deleted from ${section} section succesfully`))
}


function addToSection(bookIsbn,section,username){
    let data ={
        isbn:bookIsbn
    }
    fetch(`/api/list/${section}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "referrer": username,
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json()).then(data => alert(` book add to ${section} section succesfully`))
}

function getBooks() {
    return fetch('/api/books', {
        method: 'GET'
    }).then((response) => {
        return response.json()
    })
}

function onRegisterCreateNewUser() {
    let data = {
        userName: document.getElementById('login-input').value
    }
    fetch(`/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json()).then(data => alert(`${data.userName} Succesfully Registered, Please click Login`))
}

