const searchUrl = "https://openlibrary.org/search.json";
const storageKey = "book-nook-bookshelf";

const form = document.getElementById("search-form");
const queryInput = document.getElementById("query");
const searchButton = form.querySelector("button");
const searchStatus = document.getElementById("search-status");
const resultsList = document.getElementById("results");
const shelfStatus = document.getElementById("shelf-status");
const shelfList = document.getElementById("shelf");
const bookTemplate = document.getElementById("book-card");

let searchResults = [];
let bookshelf = [];

function showStatus(element, message, isError = false) {
  element.textContent = message;

  if (isError) {
    element.classList.add("error");
  } else {
    element.classList.remove("error");
  }
}

// Convert each Open Library record into an object used by both lists.
function makeBook(record) {
  let author = "Unknown author";

  if (record.author_name && record.author_name.length > 0) {
    author = record.author_name.join(", ");
  }

  return {
    id: record.key.replace("/works/", ""),
    title: record.title,
    author: author,
    year: record.first_publish_year || "Unknown",
    editions: record.edition_count || "Unknown"
  };
}

function isSaved(bookId) {
  for (const book of bookshelf) {
    if (book.id === bookId) {
      return true;
    }
  }

  return false;
}

function makeBookCard(book, onShelf) {
  const card = bookTemplate.content.firstElementChild.cloneNode(true);

  card.querySelector("h3").textContent = book.title;
  card.querySelector(".author").textContent = book.author;
  card.querySelector(".year").textContent = book.year;
  card.querySelector(".editions").textContent = book.editions;

  const button = card.querySelector(".book-action");

  if (onShelf) {
    button.textContent = "Remove";
    button.setAttribute("aria-label", `Remove ${book.title} from bookshelf`);
    button.addEventListener("click", function () {
      removeBook(book.id);
    });
  } else {
    button.textContent = "Save to bookshelf";
    button.addEventListener("click", function () {
      saveBook(book);
    });
    updateSaveButton(button, book.id);
  }

  return card;
}

function updateSaveButton(button, bookId) {
  if (isSaved(bookId)) {
    button.textContent = "Saved to bookshelf";
    button.disabled = true;
  } else {
    button.textContent = "Save to bookshelf";
    button.disabled = false;
  }
}

function displayBooks(books, list, onShelf) {
  list.textContent = "";

  for (const book of books) {
    list.appendChild(makeBookCard(book, onShelf));
  }
}

function displayBookshelf() {
  displayBooks(bookshelf, shelfList, true);

  if (bookshelf.length === 0) {
    showStatus(shelfStatus, "Your bookshelf is empty.");
  } else {
    showStatus(shelfStatus, "");
  }
}

// localStorage stores strings. JSON converts the saved string back to an array.
function loadBookshelf() {
  try {
    const savedBooks = localStorage.getItem(storageKey);

    if (savedBooks) {
      const storedBooks = JSON.parse(savedBooks);

      if (Array.isArray(storedBooks)) {
        bookshelf = storedBooks;
      }
    }

    displayBookshelf();
  } catch (error) {
    showStatus(shelfStatus, "Saved books could not be loaded.", true);
  }
}

function updateBookshelf(nextBookshelf) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(nextBookshelf));
  } catch (error) {
    showStatus(shelfStatus, "The bookshelf could not be updated.", true);
    return;
  }

  bookshelf = nextBookshelf;
  displayBookshelf();

  // Update the buttons without closing any expanded search results.
  const saveButtons = resultsList.querySelectorAll(".book-action");

  for (let i = 0; i < searchResults.length; i++) {
    updateSaveButton(saveButtons[i], searchResults[i].id);
  }
}

function saveBook(book) {
  if (!isSaved(book.id)) {
    updateBookshelf(bookshelf.concat(book));
  }
}

function removeBook(bookId) {
  const nextBookshelf = [];

  for (const book of bookshelf) {
    if (book.id !== bookId) {
      nextBookshelf.push(book);
    }
  }

  updateBookshelf(nextBookshelf);
}

function searchBooks(event) {
  event.preventDefault();

  if (searchButton.disabled) {
    return;
  }

  const query = queryInput.value.trim();

  if (query === "" || query.length > 200) {
    showStatus(searchStatus, "Enter a title or author using 1–200 characters.", true);
    queryInput.setAttribute("aria-invalid", "true");
    queryInput.focus();
    return;
  }

  queryInput.removeAttribute("aria-invalid");
  searchResults = [];
  resultsList.textContent = "";
  searchButton.disabled = true;
  showStatus(searchStatus, "Searching Open Library…");

  const fields = "key,title,author_name,first_publish_year,edition_count";
  const url = `${searchUrl}?q=${encodeURIComponent(query)}&limit=12&fields=${fields}`;

  fetch(url)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`Search returned HTTP ${response.status}`);
      }

      return response.json();
    })
    .then(function (data) {
      for (const record of data.docs) {
        if (record.key && record.title) {
          searchResults.push(makeBook(record));
        }
      }

      if (searchResults.length === 0) {
        showStatus(searchStatus, `No books found for “${query}”.`);
      } else {
        displayBooks(searchResults, resultsList, false);
        showStatus(searchStatus, "");
      }
    })
    .catch(function () {
      searchResults = [];
      resultsList.textContent = "";
      showStatus(searchStatus, "The search failed. Please try again.", true);
    })
    .finally(function () {
      searchButton.disabled = false;
    });
}

loadBookshelf();
form.addEventListener("submit", searchBooks);
