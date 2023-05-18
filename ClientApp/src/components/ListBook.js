import {Container, Row, Table} from "reactstrap";
import {Link} from "react-router-dom";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPenSquare, faTrashCan} from '@fortawesome/free-solid-svg-icons';
import {useEffect, useState} from "react";
import useDependencyProvider from "../hooks/useDependencyProvider";

export default function ListBook() {
    const dependencies = useDependencyProvider();
    const bookRepository = dependencies.bookRepository;
    
    const [books, setBooks] = useState([]);

    useEffect(() => {
        async function fetchData() {
            setBooks(await bookRepository.getBooks());
        }

        fetchData();
    }, [bookRepository]);
    
    const mappedBooks = books.map(book => (<tr key={book.id}>
        <td>{book.id}</td>
        <td>{book.title}</td>
        <td>{book.author}</td>
        <td>{book.year}</td>
        <td>
            <ul className={"list-inline m-0"}>
                <li key={book.id} className={"list-inline-item"}>
                    <Link to={`books/edit/${book.id}`} title={"Edit button"}
                          className={"btn btn-outline-warning btn-sm rounded-0"}><FontAwesomeIcon
                        icon={faPenSquare}/></Link>
                </li>
                <li className={"list-inline-item"}>
                    <Link to={`books/delete/${book.id}`}
                          className={"btn btn-outline-danger btn-sm rounded-0"}><FontAwesomeIcon
                        icon={faTrashCan}/></Link>
                </li>
            </ul>
        </td>
    </tr>));

    return (<Container className={"pt-2"}>
        <Row>
            <Link to={"/books/create"} className={"btn btn-success flex-grow-1"}>Create New</Link>
        </Row>
        <Row>
            <Table className={"flex-grow-1 flex-shrink-0"}>
                <thead>
                <tr>
                    <th>Id</th>
                    <th>Title</th>
                    <th>Author</th>
                    <th>Year</th>
                    <th>Actions</th>
                </tr>
                </thead>
                {books && <tbody>
                {mappedBooks}
                </tbody>}
            </Table>
        </Row>
    </Container>);
}