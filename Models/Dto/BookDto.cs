namespace BookManager.Models.Dto;

public class BookDto
{
    public string Title { get; set; } = null!;
    public string Author { get; set; } = null!;
    public int Year { get; set; }
}