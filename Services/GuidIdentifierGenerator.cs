using BookManager.Services.Abstractions;

namespace BookManager.Services;

public class GuidIdentifierGenerator : IIdentifierGenerator
{
    public string GetNextIdentifier()
    {
        return Guid.NewGuid()
            .ToString();
    }
}