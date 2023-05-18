using AutoMapper;
using BookManager.Models;
using BookManager.Models.Dto;
using BookManager.Services.Abstractions;
using Microsoft.AspNetCore.Mvc;

namespace BookManager.Controllers;

[Route(template: "api/[controller]")]
[ApiController]
public class BookController : ControllerBase
{
    private readonly IRepository<Book, string> bookRepository;
    private readonly ILogger<BookController> logger;
    private readonly IMapper mapper;

    public BookController(IRepository<Book, string> bookRepository, IMapper mapper, ILoggerFactory loggerFactory)
    {
        this.bookRepository = bookRepository;
        this.mapper = mapper;
        logger = loggerFactory.CreateLogger<BookController>();
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Book>>> GetBooks()
    {
        var books = await bookRepository.GetItemsAsync();

        logger.LogInformation("[GET] GetBooks: returning JSON books from database");
        return books.ToList();
    }

    [HttpGet(template: "{id}")]
    public async Task<ActionResult<Book>> GetBook(string id)
    {
        var book = await bookRepository.GetItemAsync(id);
        if (book is null)
        {
            logger.LogWarning("[GET] GetBook: book with ID '{BookId}' not found, returning 404 Not Found", id);
            return NotFound();
        }

        logger.LogInformation("[GET] GetBook: returning JSON book with ID '{BookId}' from database", id);
        return book;
    }

    [HttpPost]
    public async Task<ObjectResult> PostBook(BookDto bookDto, [FromServices] IIdentifierGenerator identifierGenerator)
    {
        if (!ModelState.IsValid)
        {
            logger.LogWarning("[POST] PostBook: model is not valid, returning 400 Bad Request");
            return BadRequest(ModelState);
        }

        var book = mapper.Map<Book>(bookDto);
        book.Id = identifierGenerator.GetNextIdentifier();

        await bookRepository.AddItemsAsync(book);
        logger.LogInformation("[POST] PostBook: sucessfully created book with ID '{BookId}', returning JSON of created book", book.Id);
        return CreatedAtAction(value: book, actionName: nameof(GetBook), routeValues: new { id = book.Id });
    }

    [HttpPut(template: "{id}")]
    public async Task<IActionResult> PutBook(string id, BookDto bookDto)
    {
        if (!ModelState.IsValid)
        {
            logger.LogWarning("[PUT] PostBook: model is not valid, returning 400 Bad Request");
            return BadRequest(ModelState);
        }

        var book = mapper.Map<Book>(bookDto);
        book.Id = id;

        await bookRepository.EditItemAsync(book.Id, book);
        logger.LogInformation("[PUT] PutBook: sucessfully edited book with ID '{BookId}', returning 200 OK", book.Id);
        return NoContent();
    }

    [HttpDelete(template: "{id}")]
    public async Task<IActionResult> DeleteBook(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            logger.LogWarning("[DELETE] DeleteBook: passed 'id' is not valid, returning 400 Bad Request");
            return BadRequest("Passed 'id' is not valid");
        }

        try
        {
            await bookRepository.DeleteItemAsync(id);
        }
        catch (Exception exception)
        {
            logger.LogWarning(
                "[DELETE] DeleteBook: error occurred when deleting book with id '{BookId}' ({ErrorMessage}), returning 404 Not Found", id,
                exception.Message);
            return NotFound();
        }

        logger.LogInformation("[DELETE] DeleteBook: sucessfully deleted book with ID '{BookId}', returning 204 No Content", id);
        return NoContent();
    }
}