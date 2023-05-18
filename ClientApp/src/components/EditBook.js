import {useEffect, useState} from "react";
import {Button, Container, FormGroup, Input, Label, Row} from "reactstrap";
import {Link, useNavigate, useParams} from 'react-router-dom';
import {Book} from "../models/book";
import useDependencyProvider from "../hooks/useDependencyProvider";
export default function EditBook() {
    const navigate = useNavigate();
    const { id } = useParams();
    const dependencyProvider = useDependencyProvider();
    const bookRepository = dependencyProvider.bookRepository;
    
    const [title, setTitle] = useState();
    const [author, setAuthor] = useState();
    const [year, setYear] = useState();
    
    useEffect(() => {
        async function fetchData() {
            const book = await bookRepository.getBook(id);

            setTitle(book.title);
            setAuthor(book.author);
            setYear(book.year); 
        }
         
        fetchData();
    }, [id, bookRepository]);
    
    const onSubmit = async function () {
        const book = new Book(id, title, author, year);
        await bookRepository.editBook(book);
        navigate('/');
    }

    return (<Container className={"pt-2"}>
        <h1>Edit</h1>
        <h4>Book</h4>
        <hr/>

        <Row className={"justify-content-center"}>
            <div className={"col-md-4"}>
                <div>
                    <FormGroup className={"mt-2"}>
                        <Label htmlFor={"title"}>Title</Label>
                        <Input id={"title"} type={"text"} defaultValue={title}
                               onChange={event => setTitle(event.target.value)}/>
                    </FormGroup>
                    <FormGroup className={"mt-2"}>
                        <Label htmlFor={"author"}>Author</Label>
                        <Input id={"author"} type={"text"} defaultValue={author}
                               onChange={event => setAuthor(event.target.value)}/>
                    </FormGroup>
                    <FormGroup className={"mt-2"}>
                        <Label htmlFor={"year"}>Year</Label>
                        <Input id={"year"} type={"number"} defaultValue={year}
                               onChange={event => setYear(parseInt(event.target.value))}/>
                    </FormGroup>
                    <FormGroup className={"mt-2 d-flex flex-column gap-1"}>
                        <Button className={"btn-primary w-100"}
                                onClick={onSubmit}>Save</Button>
                        <Link to={"/"} className={"btn btn-secondary w-100"}>Cancel</Link>
                    </FormGroup>
                </div>
            </div>
        </Row>
    </Container>);
}