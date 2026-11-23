# Book Nook

Book Nook searches Open Library and saves books to a personal reading list.

## Run locally

From the project folder, run `python -m http.server 8000` and open
`http://localhost:8000` in your browser. You can also upload all four project
files to the same folder on GitHub Pages.

Search and book covers require internet access. The bookshelf is stored in
the current browser for the address where the app runs.

## Use the app

1. Enter a book title or author and select **Search**.
2. Select **Book details** to expand or collapse a result.
3. Select **Save to bookshelf** to add a book. Refresh to see it persist.
4. Expand saved books in **My bookshelf** or select **Remove** to delete one.

## Sources

- [Open Library Search API](https://openlibrary.org/dev/docs/api/search) for search parameters and response fields.
- [Open Library Covers API](https://openlibrary.org/dev/docs/api/covers) for cover images.
- [MDN HTML details element](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/details) for expandable book details.
- [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) for bookshelf persistence.
