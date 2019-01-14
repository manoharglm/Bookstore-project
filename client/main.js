let booksData = null
fetch('/api/books', {
    method: 'GET'
}).then((response) => {
    return response.json()
}).then(books => {
    booksData = books
})

async function onclickGetBooks() {
    await getUserDataBySection("want_to_read")
    await getUserDataBySection("read")
    await getUserDataBySection("reading")
}

function showDiv() {
    document.getElementById('bookstore-section-books-id').style.visibility = "visible";
    document.getElementById('bookstore-login').style.display = "none";
    document.getElementById('bookstore-logout-search').style.visibility = "visible";
    document.body.style.overflowY = "unset";
}

function displayBooks(username) {
    fetch('/api/books', {
            method: 'GET'
        }).then((response) => {
            return response.json()
        })
        .then(books => {
            showDiv() //Displays Hidden files after verification is done
            books.forEach(book => {
                $('.bookstore-books').append(
                    `<div>
                            <img src="${book.cover}">
                            <p>${book.title}</p>
                            <div id="${book.isbn}" class="bookstore-section-select">
                                <button onclick='addToSection("${book.isbn}","want_to_read","${username}");' >
                                    want_to_read
                                </button>
                                <button onclick='addToSection("${book.isbn}","read","${username}");' >
                                    Read
                                </button>
                                <button onclick='addToSection("${book.isbn}","reading","${username}");' >
                                    Reading
                                </button>
                            </div>
                        </div>`)
            });
        })
}

function getUserDataBySection(section) {
    let username = document.getElementById('login-input').value
    // let sectionISBNs = [];
    fetch(`/api/list/${section}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "referrer": username,
            },
        })
        .then(response => {
            return response.json()
        })
        .then((sectionISBNs) => {
            let arrISBNs = []
            sectionISBNs[0][section].forEach(element => {
                arrISBNs.push(element.isbn)
            })
            getBooks().then((books) => {
                fetchTitleAndImage(books, arrISBNs, section, username)
            })
        })

    // .then((sectionBooks) => {
    //     sectionISBNs = sectionBooks.map(b => b.isbn);
    //     return sectionISBNs;
    // })
    // .then(() => {
    //     return getBooks()
    // })
    // .then(allBooks => {
    //     fetchTitleAndImage(allBooks, sectionISBNs, section, username)
    // })
}

function fetchTitleAndImage(books, booksArr, section, username) {
    $(`.bookstore-${section}-section`).remove()
    // $(`.section-header`).remove()
    // $('.bookstore-section-books').append(`<h3 class='section-header'>${section}</h3>`)
    // let sectionBooks = books.filter(book => booksArr.includes(book.isbn))
    // let sectionBooksHTML = sectionBooks.map(book => )
    for (let i = 0; i < books.length; i++) {
        if (booksArr.includes(books[i].isbn)) {
            $(`.bookstore-${section}-books`).append(
                `<div class="bookstore-${section}-section" >
                    <img src="${books[i].cover}">
                    <p>${books[i].title}</p>
                    <button onclick='deleteBookFromSection("${section}","${books[i].isbn}","${username}")' >
                        Delete
                    </button>
                </div>`)
        }
    }
}

function deleteBookFromSection(section, bookIsbn, username) {
    fetch(`/api/list/${section}/${bookIsbn}`, {
            method: "DELETE",
            headers: {
                "referrer": username,
            }
        })
        .then(response => response.json()).then(() => {
            onclickGetBooks()
            // alert(` book deleted from ${section} section succesfully`)
        })
}


function addToSection(bookIsbn, section, username) {
    let isbnObj = {
        isbn: bookIsbn
    }


        let arr = ['want_to_read', 'read', 'reading']
        for (let i = 0; i < arr.length; i++) {
            if(arr[i] === section){
                fetch(`/api/list/${section}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "referrer": username,
                    },
                    body: JSON.stringify(isbnObj)
                }).then(response => {
                    if (response.status === 400) {
                        // alert(` book already Exists`)
                    } else {
                        onclickGetBooks()
                        // alert(` book add to ${section} section succesfully`)
                    }
                })
            }
            else{
                fetch(`/api/list/${arr[i]}/${bookIsbn}`, {
                    method: "DELETE",
                    headers: {
                        "referrer": username,
                    }
                }).then(response => {
                    if (response.status === 400) {
                        // alert(` book already Exists`)
                    } else {
                        onclickGetBooks()
                        // alert(` book add to ${section} section succesfully`)
                    }
                })
            }
        }
    fetch(`/api/list/${section}/${bookIsbn}`, {
            method: "DELETE",
            headers: {
                "referrer": username,
            }
        })
        .then(response => response.json()).then(() => {
            onclickGetBooks()
            // alert(` book deleted from ${section} section succesfully`)
        })


}

function getBooks() {
    return fetch('/api/books', {
        method: 'GET'
    }).then((response) => {
        return response.json()
    })
}

function onRegisterCreateNewUser() {
    let userObj = {
        userName: document.getElementById('login-input').value
    }
    fetch(`/api/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(userObj)
        })
        .then(response => {
            if (response.status === 400) {
                alert('Invalid username')
            } else {
                response.json()
            }
        })
        .then(_ => {
            onclickGetBooks()
            getBooksData()
        })
}

function getBooksData() {
    let username = document.getElementById('login-input').value
    fetch(`/api/list/read`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "referrer": username,
            },
        })
        .then(response => {
            if (response.status !== 200) {
                alert('Invalid Username')
            } else {
                displayBooks(username)
            }
        })
}

function fuseSearch() {
    let searchText = document.getElementById('search-input').value
    $('.bookstore-search-result').empty()
    let options = {
        keys: ['title'],
        threshold: 0.3,

    }
    let fuse = new Fuse(booksData, options)
    let result = fuse.search(searchText)
    for (let i = 0; i < result.length; i++) {
        $(`.bookstore-search-result`).append(
            `<div>
                        <img src="${result[i].cover}">
                        <p>${result[i].title}</p>
                    </div>`)
    }
    res(true)
}