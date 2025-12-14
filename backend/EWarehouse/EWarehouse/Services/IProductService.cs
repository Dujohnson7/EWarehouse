using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IProductService
    {
        Task<IEnumerable<Product>> GetAllProductsAsync();
        Task<Product?> GetProductByIdAsync(int id);
        Task<int> CreateProductAsync(CreateProductDto dto, int performingUserID);
        Task<bool> UpdateProductAsync(int id, UpdateProductDto dto, int performingUserID);
        Task<bool> DeleteProductAsync(int id, int performingUserID);
    }
}
