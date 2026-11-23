const libraryUrl = "https://openlibrary.org";
const storageKey = "book-nook-bookshelf";

const form = document.querySelector("#search-form");
const queryInput = document.querySelector("#query");
const searchStatus = document.querySelector("#search-status");
const resultsList = document.querySelector("#results");
const shelfList = document.querySelector("#shelf");
const shelfStatus = document.querySelector("#shelf-status");
const shelfCount = document.querySelector("#shelf-count");
const bookTemplate = document.querySelector("#book-card");

let requestNumber = 0;
let bookshelf = [];

// Read the saved bookshelf when the page opens.
try {
  const savedBooks = JSON.parse(localStorage.getItem(storageKey));
  if (Array.isArray(savedBooks)) {
    bookshelf = savedBooks.filter((book) => book && typeof book.id === "string");
  }
} catch {
  showStatus(shelfStatus, "Saved books could not be loaded.", true);
}

function showStatus(element, message, isError = false) {
  element.textContent = message;
  element.classList.toggle("error", isError);
}

// Convert an API record into the book object used by both lists.
function makeBook(record) {
  const workId = /^(?:\/works\/)?(OL\d+W)$/.exec(record.key)?.[1];

  if (!workId || !record.title) {
    return null;
  }

  return {
    id: workId,
    title: record.title,
    author: record.author_name?.join(", ") || "Unknown author",
    year: record.first_publish_year ?? "Unknown",
    editions: record.edition_count ?? "Unknown",
    coverId: record.cover_i
  };
}

function makeBookCard(book, onShelf = false) {
  const card = bookTemplate.content.firstElementChild.cloneNode(true);

  card.querySelector("h3").textContent = book.title;
  card.querySelector(".author").textContent = book.author;
  card.querySelector(".year").textContent = book.year;
  card.querySelector(".editions").textContent = book.editions;
  card.querySelector(".book-link").href =
    `${libraryUrl}/works/${encodeURIComponent(book.id)}`;

  if (book.coverId) {
    const image = document.createElement("img");
    const coverId = encodeURIComponent(book.coverId);

    image.src = `https://covers.openlibrary.org/b/id/${coverId}-M.jpg?default=false`;
    image.alt = "";
    image.loading = "lazy";
    image.addEventListener("error", () => image.remove());

    card.querySelector(".cover").append(image);
  }

  const button = card.querySelector(".book-action");
  button.dataset.bookId = book.id;

  if (onShelf) {
    button.textContent = "Remove";
    button.setAttribute("aria-label", `Remove ${book.title} from bookshelf`);
    button.addEventListener("click", () => updateShelf(book, true));
  } else {
    button.addEventListener("click", () => updateShelf(book, false));
  }

  return card;
}

function syncResultButtons() {
  for (const button of resultsList.querySelectorAll(".book-action")) {
    const saved = bookshelf.some((book) => book.id === button.dataset.bookId);

    button.disabled = saved;
    button.textContent = saved ? "Saved to bookshelf" : "Save to bookshelf";
  }
}

function renderShelf() {
  shelfList.replaceChildren(...bookshelf.map((book) => makeBookCard(book, true)));
  shelfCount.textContent = bookshelf.length;
}

function updateShelf(book, remove) {
  if (!remove && bookshelf.some((saved) => saved.id === book.id)) {
    return;
  }

  const nextShelf = remove
    ? bookshelf.filter((saved) => saved.id !== book.id)
    : [...bookshelf, book];

  // Update the page after the browser saves the new list.
  try {
    localStorage.setItem(storageKey, JSON.stringify(nextShelf));
  } catch {
    showStatus(
      shelfStatus,
      "The bookshelf could not be updated. Check whether browser storage is enabled.",
      true
    );
    return;
  }

  bookshelf = nextShelf;
  renderShelf();
  syncResultButtons();

  const message = remove ? `Removed “${book.title}”.` : `Saved “${book.title}”.`;
  showStatus(shelfStatus, message);

  if (remove) {
    (shelfList.querySelector(".book-action") || queryInput).focus();
  }
}

async function searchBooks(event) {
  event.preventDefault();

  const query = queryInput.value.trim();
  const currentRequest = ++requestNumber;
  resultsList.replaceChildren();
  queryInput.removeAttribute("aria-invalid");

  if (!query || query.length > 200) {
    showStatus(searchStatus, "Enter a book title or author using 1–200 characters.", true);
    queryInput.setAttribute("aria-invalid", "true");
    queryInput.focus();
    return;
  }

  showStatus(searchStatus, "Searching Open Library…");

  const params = new URLSearchParams({
    q: query,
    limit: "12",
    fields: "key,title,author_name,first_publish_year,edition_count,cover_i"
  });

  try {
    const response = await fetch(`${libraryUrl}/search.json?${params}`);

    if (!response.ok) {
      throw new Error(`Search returned HTTP ${response.status}`);
    }

    const data = await response.json();

    // An older request should never overwrite a newer search.
    if (currentRequest !== requestNumber) {
      return;
    }

    const books = data.docs.map(makeBook).filter(Boolean);

    if (!books.length) {
      showStatus(searchStatus, `No books found for “${query}”. Try another title or author.`);
      return;
    }

    resultsList.replaceChildren(...books.map((book) => makeBookCard(book)));
    syncResultButtons();

    const resultLabel = books.length === 1 ? "result" : "results";
    showStatus(searchStatus, `Showing ${books.length} ${resultLabel} for “${query}”.`);
  } catch {
    if (currentRequest === requestNumber) {
      showStatus(searchStatus, "Open Library could not be reached. Please try again.", true);
    }
  }
}

renderShelf();

if (!bookshelf.length && !shelfStatus.textContent) {
  showStatus(shelfStatus, "Save a book from your search results to add it here.");
}

form.addEventListener("submit", searchBooks);
