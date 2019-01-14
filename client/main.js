let username = null
let booksData = null
fetch('/api/books', {
    method: 'GET'
}).then((response) => {
    return response.json()
}).then(books => {
    booksData = books
})

async function onclickGetBooks() {
   let want_to_read = await getUserDataBySection("want_to_read")
   let read = await getUserDataBySection("read")
   let reading = await getUserDataBySection("reading")
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
                        <div class="bookstore-section-select">
                            <button id="button-want_to_read-${book.isbn}" 
                                    class="add-book-button" 
                                    data-isbn="${book.isbn}" 
                                    data-user="${username}" 
                                    data-section="want_to_read" 
                                >
                                want_to_read
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
                // onclickGetBooks()

}

function onclickAddBookToSection(){
    const keys = Array.from(document.querySelectorAll('.add-book-button'))

    keys.forEach(key => key.addEventListener('click', function(element){
        addToSection(key.dataset.isbn, key.dataset.section, key.dataset.user)
    }))
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
            getBooks().then((books) => {
                fetchTitleAndImage(books, arrISBNs, section, username)
            })
        })
}

function fetchTitleAndImage(books, booksArr, section, username) {
    $(`.bookstore-${section}-section`).remove()
    let sectionBooks = books.filter(book => booksArr.includes(book.isbn))

    sectionBooks.map(book =>{
        $(`.bookstore-${section}-books`).append(
            `<div class="bookstore-${section}-section" >
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
            </div>`)
    })
    onclickDeleteBookFromSection()
}

function onclickDeleteBookFromSection(){
    const keys = Array.from(document.querySelectorAll('.delete-book-button'))

    keys.forEach(key => key.addEventListener('click', function(element){
        deleteBookFromSection( key.dataset.section,key.dataset.isbn, key.dataset.user)
    }))
}

function deleteBookFromSection(section, bookIsbn, username) {
    fetch(`/api/list/${section}/${bookIsbn}`, {
            method: "DELETE",
            headers: {
                "referrer": username,
            }
        })
        .then(response => response.json())
        onclickGetBooks()
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
                })
            }
            else{
                fetch(`/api/list/${arr[i]}/${bookIsbn}`, {
                    method: "DELETE",
                    headers: {
                        "referrer": username,
                    }
                })
            }
            onclickGetBooks()
        }
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
            }else if(response.status===409){
                alert('Username already exits, Please login')
            }
             else {
                onclickGetBooks()
                getBooksData()
            }
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
