namespace BookManager.Services.Abstractions;

public interface IIdentifierGenerator
{
    public string GetNextIdentifier();
}