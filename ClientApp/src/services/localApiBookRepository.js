import axios from "axios";
import BookRepositoryBase from "./abstractions/bookRepositoryBase";

export default class LocalApiBookRepository extends BookRepositoryBase {
    constructor() {
        const host = process.env.REACT_APP_BOOK_API_HOST;
        const port = process.env.REACT_APP_BOOK_API_PORT;
        const route = process.env.REACT_APP_BOOK_API_ROUTE;
        const combinedBaseUrl = `https://${host}:${port}${route}`;

        super(host, port, route, combinedBaseUrl);
    }

    async getBooks() {
        let books;
        await axios.get(this.combinedBaseUrl).then(response => books = response.data);
        return books;
    }

    async getBook(bookId) {
        let book;
        await axios.get(`${this.combinedBaseUrl}/${bookId}`).then(response => book = response.data);
        console.log(JSON.stringify(book));
        return book;
    }

    async addBook(book) {
        await axios.post(this.combinedBaseUrl, book);
    }

    async editBook(book) {
        await axios.put(`${this.combinedBaseUrl}/${book.id}`, book);
    }

    async deleteBook(bookId) {
        await axios.delete(`${this.combinedBaseUrl}/${bookId}`);
    }

}
