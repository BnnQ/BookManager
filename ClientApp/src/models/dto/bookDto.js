export class BookDto {
    constructor(title = '', author = '', year = 0) {
        this.title = title;
        this.author = author;
        this.year = year;
    }
}