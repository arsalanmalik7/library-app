import { initializeApp, } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { collection, addDoc, query, onSnapshot, serverTimestamp, orderBy, deleteDoc, updateDoc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";
import { doc } from "https://www.gstatic.com/firebasejs/9.22.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyC8G4f1LlJapbd4WF9ac-Wek3Ed8ogq-u4",
    authDomain: "library-app-fec86.firebaseapp.com",
    projectId: "library-app-fec86",
    storageBucket: "library-app-fec86.appspot.com",
    messagingSenderId: "959393756251",
    appId: "1:959393756251:web:a1c40e3a534194567e7b7e"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);


let addBook = document.querySelector("#formOfInputs");




addBook.addEventListener('submit', async (event) => {
    event.preventDefault();


    let bookName = document.querySelector("#bookName").value;
    let authorName = document.querySelector("#authorName").value;
    let genre = document.querySelector("#genre").value;


    try {
        const docRef = await addDoc(collection(db, "books"), {
            bookName: bookName,
            authorName: authorName,
            genre: genre,
            createdAt: serverTimestamp()
        });



    } catch (e) {
        console.error("Error adding document: ", e);
    }
})

let loading = document.querySelector("#loading");
loading.setAttribute("class", "hidden")

let bookGrid = document.createElement('div');
bookGrid.style.display = 'flex';
bookGrid.style.flexWrap = 'wrap';
bookGrid.style.gap = '3rem';
bookGrid.style.marginTop = '1rem';

let sibling = document.querySelector("#inputs");
let parent = sibling.parentNode;
let nextSibling = loading.parentNode.nextSibling.nextSibling;
parent.insertBefore(bookGrid, nextSibling);

document.addEventListener("readystatechange", async (event) => {
    console.log(`'readystate: ', ${document.readyState}`);

    let bookName = document.querySelector("#bookName").value;
    let authorName = document.querySelector("#authorName").value;
    let genre = document.querySelector("#genre").value;

    const q = query(collection(db, "books"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
        if (querySnapshot.size === 0) {

            let head = document.querySelector("#head");
            head.innerHTML = 'No Books Found';

        } else {
            head.innerHTML = '';
        }


        bookGrid.innerHTML = '';
        querySnapshot.forEach((doc) => {


            let book = document.createElement('div');
            book.setAttribute('class', 'book');
            book.setAttribute('id', `book${doc.id}`);
            let bookCover = document.createElement('div');
            bookCover.setAttribute('class', 'book-cover')

            let div = document.createElement('div');

            let data = doc.data();
            let h1 = document.createElement('h1');
            h1.innerHTML = data.bookName;
            div.appendChild(h1);

            let separator = document.createElement('div');
            separator.setAttribute('class', 'separator')
            div.appendChild(separator);
            let h2 = document.createElement('h2');
            h2.innerHTML = `by &nbsp;${data.authorName}`;
            div.appendChild(h2);
            bookCover.appendChild(div);
            book.appendChild(bookCover);

            let bookContent = document.createElement('div');
            bookContent.setAttribute('class', 'book-content');
            let genreName = document.createElement('h1');
            genreName.style.paddingLeft = '12px'
            genreName.innerHTML = data.genre;
            bookContent.appendChild(genreName);
            book.appendChild(bookContent);
            bookGrid.appendChild(book);

            let deleteBtn = document.createElement('button');
            deleteBtn.innerText = 'Book Sold Out';
            deleteBtn.setAttribute('class', 'delete-btn');
            deleteBtn.setAttribute('onclick', `deleteBook('${doc.id}')`);
            bookContent.appendChild(deleteBtn);

            let updateBtn = document.createElement('button');
            updateBtn.innerText = 'Update Book';
            updateBtn.setAttribute('class', 'update-btn');
            updateBtn.setAttribute('onclick', `updateBook('${doc.id}', '${data.bookName}', '${data.authorName}', '${data.genre}')`);
            bookContent.appendChild(updateBtn);


        });
    });


    window.updateBook = (docId, book, author, genre) => {

        let popup = document.createElement('div');
        popup.innerHTML +=
            `<form class="form_main"  onsubmit="submitBook(event, '${docId}')">
        <span id="corss" onclick="hide()">&#10006;</span>
        <p class="heading">Edit Book</p>
        <div class="inputContainer">
            <input
                placeholder="Book name"
                id="book-name"
                class="inputField"
                type="text"
                value="${book}"
            >
        </div>
        <div class="inputContainer">
            <input
                placeholder="Author name"
                id="author-name"
                class="inputField"
                type="text"
                value="${author}"
            >
        </div>
        <div class="inputContainer">
            <input
                placeholder="Genre"
                id="genre-name"
                class="inputField"
                type="text"
                value="${genre}"
            >
        </div>
        <button id="button" >Update Book</button>
    </form>`
        popup.setAttribute('id', 'popupOverlay');
        popup.style.display = 'flex';
        let parent = addBook.parentNode.parentNode;
        parent.appendChild(popup);
        parent.style.overflow = 'hidden';

        window.hide = () => {
            parent.style.overflow = 'auto';
            popup.remove();
        }
    }

    window.submitBook = async (e, docId) => {
        e.preventDefault();
        let parent = addBook.parentNode.parentNode;
        let last = parent.lastChild

        last.remove();
        parent.style.overflow = 'auto';
        await updateDoc(doc(db, 'books', docId), {
            bookName: e.target[0].value,
            authorName: e.target[1].value,
            genre: e.target[2].value,
        });


    }

    window.deleteBook = async (docId) => {
        await deleteDoc(doc(db, "books", docId));
    }
})





























































































