# Book Finder

Book Nook searches Open Library by title or author. Select **Book details**
to expand or collapse the publication information for a book.

Use **Save to bookshelf** to add a book to your reading list. Saved books
can be viewed or removed in **My bookshelf**. The bookshelf uses
`localStorage` to keep saved books after a page refresh.

## Run locally

Run `python -m http.server 8000` from the project folder, then open
`http://localhost:8000` in your browser. Search requires internet access.

## Sources

- [Open Library Search API](https://openlibrary.org/dev/docs/api/search) for search parameters and book data.
- [MDN details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) for expandable details.
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for saving the bookshelf.
- [MDN encodeURIComponent](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/encodeURIComponent) for encoding the search query.
