using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface ICategoryService
    {
        Task<IEnumerable<Category>> GetAllCategoriesAsync();
        Task<Category?> GetCategoryByIdAsync(int id);
        Task<int> CreateCategoryAsync(CreateCategoryDto dto, int performingUserID);
        Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto dto, int performingUserID);
        Task<bool> DeleteCategoryAsync(int id, int performingUserID);
    }
}
