let booksData = null
fetch('/api/books', {
    method: 'GET'
}).then((response) => {
    return response.json()
}).then(books => {
    booksData = books
})

function showDiv() {
    document.getElementById('bookstore-section-books-id').style.visibility = "visible";
    document.getElementById('bookstore-login').style.display = "none";
    document.getElementById('bookstore-logout-search').style.visibility = "visible";
    document.body.style.overflowY = "unset";
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
            } else if (response.status === 409) {
                alert('Username already exits, Please login')
            } else {
                onclickGetBooks()
                getBooksData()
            }
        })
}


function displayBooks() {
    let username = document.getElementById('login-input').value
    fetch(`/api/books`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "referrer": username,
            },
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
                        <div class="bookstore-section-select">
                            <button id="button-want_to_read-${book.isbn}" 
                                    class="add-book-button" 
                                    data-isbn="${book.isbn}" 
                                    data-user="${username}" 
                                    data-section="want_to_read" 
                                >
                                want to read
                            </button>
                            <button id="button-read-${book.isbn}" 
                                    data-isbn="${book.isbn}" 
                                    class="add-book-button" 
                                    data-user="${username}" 
                                    data-section="read" 
                                >                                
                                Read
                            </button>
                            <button id="button-reading-${book.isbn}" 
                                    data-isbn="${book.isbn}" 
                                    class="add-book-button" 
                                    data-user="${username}"
                                    data-section="reading"
                                >                                
                                Reading
                            </button>
                        </div>
                    </div>`)
            })
            onclickAddBookToSection()
        })
}

function onclickAddBookToSection() {
    const keys = Array.from(document.querySelectorAll('.add-book-button'))

    keys.forEach(key => key.addEventListener('click', function () {
        addToSection(key.dataset.isbn, key.dataset.section, key.dataset.user,$(this))
    }))
}

function addToSectionDivFunc(isbn, section, username) {
    let sectionBooks = booksData.filter(book => book.isbn === isbn)
    let sectionHTMLArr = getHTMLToAppend(sectionBooks,section,username)
    $(`.bookstore-${section}-books`).append(sectionHTMLArr.join(""))
}


function addToSection(bookIsbn, section, username,element) {
    let isbnObj = {
        isbn: bookIsbn
    }
    let arr = ['want_to_read', 'read', 'reading']
    for (let i = 0; i < arr.length; i++) {
        if (arr[i] === section) {
            fetch(`/api/list/${section}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "referrer": username,
                },
                body: JSON.stringify(isbnObj)
            }).then(()=>{
                addToSectionDivFunc(element[0].dataset.isbn, element[0].dataset.section, element[0].dataset.user)
            })
        } else {
            fetch(`/api/list/${arr[i]}/${bookIsbn}`, {
                method: "DELETE",
                headers: {
                    "referrer": username,
                }
            }).then(()=>{

                $(`.bookstore-${arr[i]}-books`).children(`.bookstore-${arr[i]}-section`).children(`#button-delete-${element[0].dataset.isbn}`).parent().remove()
            })
        }
    }
}


function onclickDeleteBookFromSection() {
    const books = Array.from(document.querySelectorAll('.delete-book-button'))

    books.forEach(book => book.addEventListener('click', function (element) {
        deleteBookFromSection(book.dataset.section, book.dataset.isbn, book.dataset.user, $(this))
    }))
}

function deleteBookFromSection(section, bookIsbn, username, element) {
    fetch(`/api/list/${section}/${bookIsbn}`, {
            method: "DELETE",
            headers: {
                "referrer": username,
            }
        })
        .then(response => response.json())
        .then(() => {
            element.parent().remove()
        })
}


async function onclickGetBooks() {
    let want_to_read = await getUserDataBySection("want_to_read")
    let read = await getUserDataBySection("read")
    let reading = await getUserDataBySection("reading")
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
            return response.json()
        })
        .then((sectionISBNs) => {
            let arrISBNs = []
            sectionISBNs[0][section].forEach(element => {
                arrISBNs.push(element.isbn)
            })
            return arrISBNs
        }).then((arrISBNs) => {
            fetchTitleAndImage(arrISBNs, section, username)
        })
}

function fetchTitleAndImage(booksArr, section, username) {
    $(`.bookstore-${section}-section`).remove()
    let sectionBooks = booksData.filter(book => booksArr.includes(book.isbn))

    let sectionHTMLArr = getHTMLToAppend(sectionBooks, section, username)

    $(`.bookstore-${section}-books`).append(sectionHTMLArr.join(""))
    onclickDeleteBookFromSection()
}

function getHTMLToAppend(sectionBooks, section, username) {
    let sectionHTMLArr = sectionBooks.map(book => {
        return `<div class="bookstore-${section}-section" >
            <img src="${book.cover}">
            <p>${book.title}</p>
            <button id="button-delete-${book.isbn}" 
                    data-isbn="${book.isbn}" 
                    class="delete-book-button" 
                    data-user="${username}"
                    data-section="${section}" 
                >
                Delete
            </button>
        </div>`
    })
    return sectionHTMLArr
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
    // res(true)
}