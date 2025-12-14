using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public class ProductService : IProductService
    {
        private readonly ApiContext _context;
        private readonly ILogger<ProductService> _logger;

        public ProductService(ApiContext context, ILogger<ProductService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Product>> GetAllProductsAsync()
        {
            return await _context.Products.Include(p => p.Category).ToListAsync();
        }

        public async Task<Product?> GetProductByIdAsync(int id)
        {
            return await _context.Products.Include(p => p.Category).FirstOrDefaultAsync(p => p.ProductID == id);
        }

        public async Task<int> CreateProductAsync(CreateProductDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductName", dto.ProductName),
                    new SqlParameter("@SKU", dto.SKU),
                    new SqlParameter("@CategoryID", dto.CategoryID),
                    new SqlParameter("@Price", dto.Price),
                    new SqlParameter("@Description", (object?)dto.Description ?? DBNull.Value),
                    new SqlParameter("@Image", (object?)dto.Image ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Product_Insert @ProductName, @SKU, @CategoryID, @Price, @Description, @Image, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating product: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateProductAsync(int id, UpdateProductDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductIDToUpdate", id),
                    new SqlParameter("@ProductName", dto.ProductName),
                    new SqlParameter("@SKU", dto.SKU),
                    new SqlParameter("@CategoryID", dto.CategoryID),
                    new SqlParameter("@Price", dto.Price),
                    new SqlParameter("@Description", (object?)dto.Description ?? DBNull.Value),
                    new SqlParameter("@Image", (object?)dto.Image ?? DBNull.Value),
                    new SqlParameter("@IsActive", dto.IsActive),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Product_Update @ProductIDToUpdate, @ProductName, @SKU, @CategoryID, @Price, @Description, @Image, @IsActive, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating product: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteProductAsync(int id, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductIDToDelete", id),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Product_Delete @ProductIDToDelete, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                 _logger.LogError($"Error deleting product: {ex.Message}");
                return false;
            }
        }
    }
}
