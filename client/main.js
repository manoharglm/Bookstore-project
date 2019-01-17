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
    document.getElementById('bookstore-login').style.display = "none";
    document.getElementById('user-data').style.display = "block";
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
            let HTMLArr = HTMLToAppendBooks(books,username)
            $('.bookstore-books').append(HTMLArr.join(""))
            onclickAddBookToSection()
        })
}

function HTMLToAppendBooks(books,username){
    let HTMLArr = books.map(book => {
            return  `<div>
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
                </div>`})
    return HTMLArr
  
}

function onclickAddBookToSection() {
    const keys = Array.from(document.querySelectorAll('.add-book-button'))
    keys.forEach(key => key.addEventListener('click', function (element) {
        addToSection(key.dataset.isbn, key.dataset.section, key.dataset.user,$(this))
    }))
}

function getUserDataBySection(section) {
    username = document.getElementById('login-input').value
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
    let sectionHTMLArr = getHTMLToAppendBooksInSection(sectionBooks, section, username)
    $(`.bookstore-${section}-books`).append(sectionHTMLArr.join(""))
    onclickDeleteBookFromSection()
}

function getHTMLToAppendBooksInSection(sectionBooks, section,username) {
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

function onclickDeleteBookFromSection() {
    const keys = Array.from(document.querySelectorAll('.delete-book-button'))
    keys.forEach(key => key.addEventListener('click', function () {
        deleteBookFromSection(key.dataset.section, key.dataset.isbn, key.dataset.user,$(this))
    }))
}

function deleteBookFromSection(section, bookIsbn, username,element) {
    fetch(`/api/list/${section}/${bookIsbn}`, {
            method: "DELETE",
            headers: {
                "referrer": username,
            }
        })
        .then(res =>{
            if(res.status === 200){
                element.parent().remove()
            }
        })
}

function addToSectionDiv(isbn, section,username) {
    let sectionBooks = booksData.filter(book => book.isbn === isbn)
    let sectionHTMLArr = getHTMLToAppendBooksInSection(sectionBooks,section,username)
    $(`.bookstore-${section}-books`).append(sectionHTMLArr.join(''))
    onclickDeleteBookFromSection()
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
            }).then((res) => {
                if(res.status ===200){
                    addToSectionDiv(element[0].dataset.isbn, element[0].dataset.section,username)
                }
            })
        } else {
            fetch(`/api/list/${arr[i]}/${bookIsbn}`, {
                method: "DELETE",
                headers: {
                    "referrer": username,
                }
            }).then((res) => {
                if(res.status === 200){
                    $(`.bookstore-${arr[i]}-books`)
                    .children(`.bookstore-${arr[i]}-section`)
                    .children(`#button-delete-${element[0].dataset.isbn}`)
                    .parent().remove()
                }
            })
        }
    }
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
    let HTMLArr = HTMLToAppendBooks(result,username)
    $(`.bookstore-search-result`).append(HTMLArr.join(''))
    onclickAddBookToSection()

}
function onclickLogout(){
    document.getElementById('bookstore-login').style.display = "block";
    document.getElementById('user-data').style.display = "none";
    document.body.style.overflowY = "hidden";
    $('.bookstore-want_to_read-books').empty()
    $('.bookstore-read-books').empty()
    $('.bookstore-reading-books').empty()
    $('.bookstore-books').empty()
}