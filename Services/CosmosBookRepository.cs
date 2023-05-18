using System.Net;
using BookManager.Models;
using BookManager.Services.Abstractions;
using BookManager.Utils.Extensions;
using Microsoft.Azure.Cosmos;
using Microsoft.Azure.Cosmos.Linq;
using Microsoft.Extensions.Options;

namespace BookManager.Services;

public class CosmosBookRepository : IRepository<Book, string>
{
    private readonly CosmosAccountClient cosmosClient;
    private readonly string containerId;
    private readonly string databaseId;
    private readonly string partitionKeyPath;

    public CosmosBookRepository(CosmosAccountClient cosmosClient, IOptions<Configuration.Azure> azureOptions)
    {
        this.cosmosClient = cosmosClient;

        databaseId = azureOptions.Value.Cosmos?.BooksDatabase?.Id ??
                     throw new InvalidOperationException("'Azure.Cosmos.BooksDatabase.Id' configuration value is not provided");

        containerId = azureOptions.Value.Cosmos.BooksDatabase.BooksContainer?.Id ??
                      throw new InvalidOperationException(
                          "'Azure.Cosmos.BooksDatabase.BooksContainer.Id' configuration value is not provided");

        partitionKeyPath = azureOptions.Value.Cosmos.BooksDatabase.BooksContainer.PartitionKeyPath ??
                           throw new InvalidOperationException(
                               "'Azure.Cosmos.BooksDatabase.BooksContainer.PartitionKeyPath' configuration value is not provided");
    }

    public async Task<IEnumerable<Book>> GetItemsAsync()
    {
        var container = await cosmosClient.GetOrCreateContainerAsync(databaseId, containerId, partitionKeyPath);
        var booksIterator = container.GetItemQueryIterator<Book>();

        return await booksIterator.GetRangeValueAsync();
    }

    public async Task<Book?> GetItemAsync(string id)
    {
        var container = await cosmosClient.GetOrCreateContainerAsync(databaseId, containerId, partitionKeyPath);
        var iterator = container.GetItemLinqQueryable<Book>()
            .Where(book => book.Id.Equals(id))
            .ToFeedIterator();

        return await iterator.GetSingleValueOrDefaultAsync();
    }

    public async Task AddItemsAsync(params Book[] items)
    {
        var container = await cosmosClient.GetOrCreateContainerAsync(databaseId, containerId, partitionKeyPath);

        foreach (var book in items)
            await container.CreateItemAsync(book, new PartitionKey(book.Id));
    }

    public async Task EditItemAsync(string id, Book editedItem)
    {
        var container = await cosmosClient.GetOrCreateContainerAsync(databaseId, containerId, partitionKeyPath);
        await container.ReplaceItemAsync(editedItem, editedItem.Id, new PartitionKey(editedItem.Id));
    }

    public async Task DeleteItemAsync(string id)
    {
        var container = await cosmosClient.GetOrCreateContainerAsync(databaseId, containerId, partitionKeyPath);
        var response = await container.DeleteItemAsync<Book>(id, new PartitionKey(id));

        if (response.StatusCode is not HttpStatusCode.NoContent and HttpStatusCode.OK)
        {
            throw new HttpRequestException($"Failed to delete item with ID: {id}");
        }
    }
}