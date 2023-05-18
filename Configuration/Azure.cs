namespace BookManager.Configuration;

public class Azure
{
    public Cosmos? Cosmos { get; set; }
}

public class Cosmos
{
    public CarsDatabase? BooksDatabase { get; set; }
}

public class CarsDatabase
{
    public string? Id { get; set; }
    public CarsContainer? BooksContainer { get; set; }
}

public class CarsContainer
{
    public string? Id { get; set; }
    public string? PartitionKeyPath { get; set; }
}