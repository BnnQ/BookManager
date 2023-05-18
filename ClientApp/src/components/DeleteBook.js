import useDependencyProvider from "../hooks/useDependencyProvider";
import {Button, Container, FormGroup, Row} from "reactstrap";
import {useEffect, useState} from "react";
import {Book} from "../models/book";
import {Link, useNavigate, useParams} from "react-router-dom";

export default function DeleteBook() {
    const navigate = useNavigate();
    const { id} = useParams();
    const dependencyProvider = useDependencyProvider();
    const bookRepository = dependencyProvider.bookRepository;
    
    const [book, setBook] = useState(new Book());
    
    useEffect(() => {
        async function fetchData() {
            setBook(await bookRepository.getBook(id));
        }
        
        fetchData();
    }, [id, bookRepository]);
    
    const onSubmit = async function() {
      await bookRepository.deleteBook(id); 
      navigate('/');
    };
    
    return (
      <Container className={"pt-2"}>
          <Row className={"justify-content-center"}>
              <div className={"col-lg-8 col-md-10 col-sm-12"}>
                  <h1 className={"text-center"}>Delete</h1>
                  <h3 className={"text-center"}>Are you sure you want to delete this?</h3>
                  <h4 className={"text-center"}>Book</h4>
                  <hr/>
                  
                  <dl className={"row"}>
                      <dt className={"col-sm-2"}>Id</dt>
                      <dd className={"col-sm-10"}>{book.id}</dd>
                      <dt className={"col-sm-2"}>Title</dt>
                      <dd className={"col-sm-10"}>{book.title}</dd>
                      <dt className={"col-sm-2"}>Author</dt>
                      <dd className={"col-sm-10"}>{book.author}</dd>
                      <dt className={"col-sm-2"}>Year</dt>
                      <dd className={"col-sm-10"}>{book.year}</dd>
                  </dl>
                  
                  <FormGroup className={"d-flex flex-column justify-content-center"}>
                      <Button className={"btn-danger flex-grow-1"} onClick={onSubmit}>Delete</Button>
                      <Link to={"/"} className={"btn btn-secondary flex-grow-1 mt-1"}>Cancel</Link>
                  </FormGroup>
                  
              </div>
          </Row>
      </Container>  
    );
}