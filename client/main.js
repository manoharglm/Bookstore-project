let booksData = null
fetch('/api/books', {
    method: 'GET'
}).then((response) => {
    return response.json()
}).then(data => {
    booksData = data
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
    let sectionISBNs = [];
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
        .then((data) => {
            let arr = []
            data[0][section].forEach(element => {
                arr.push(element.isbn)
            })
            getBooks().then((data) => {
                fetchTitleAndImage(data, arr, section,username)
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

function fetchTitleAndImage(data, booksArr, section, username) {
    $(`.bookstore-${section}-section`).remove()
    // $(`.section-header`).remove()
    // $('.bookstore-section-books').append(`<h3 class='section-header'>${section}</h3>`)
    // let sectionBooks = data.filter(book => booksArr.includes(book.isbn))
    // let sectionBooksHTML = sectionBooks.map(book => )
    for (let i = 0; i < data.length; i++) {
        if (booksArr.includes(data[i].isbn)) {
            $(`.bookstore-${section}-books`).append(
                `<div class="bookstore-${section}-section" >
                    <img src="${data[i].cover}">
                    <p>${data[i].title}</p>
                    <button onclick='deleteBookFromSection("${section}","${data[i].isbn}","${username}")' >Delete</button>
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
    let data = {
        isbn: bookIsbn
    }
    fetch(`/api/list/${section}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "referrer": username,
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.status === 400) {
                alert(` book already Exists`)
            } else {
                onclickGetBooks()
                // alert(` book add to ${section} section succesfully`)
            }
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
        .then(response => response.json())
        .then(data => alert(`${data.userName} Succesfully Registered, Please click Login`))
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
    return new Promise((res, rej) => {
        let options = {
            keys: ['title']
        }
        let fuse = new Fuse(booksData, options)
        let result = fuse.search(searchText)
        if (result.length === 0) {
            alert(`No such books ${searchText}`)
        } else {
            for (let i = 0; i < result.length; i++) {
                $(`.bookstore-search-result`).append(
                    `<div>
                        <img src="${result[i].cover}">
                        <p>${result[i].title}</p>
                    </div>`)
            }
        }
        res(true)
    })

}

function deleteSearch() {
    return new Promise((res, rej) => {
        $('.bookstore-search-result').empty()
        res(true)
    })
}
async function onclickSearch() {
    await deleteSearch()
    await fuseSearch()
}