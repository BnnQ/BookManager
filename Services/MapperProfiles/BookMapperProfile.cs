using AutoMapper;
using BookManager.Models;
using BookManager.Models.Dto;

namespace BookManager.Services.MapperProfiles;

public class BookMapperProfile : Profile
{
    public BookMapperProfile()
    {
        CreateMap<BookDto, Book>();
    }
}