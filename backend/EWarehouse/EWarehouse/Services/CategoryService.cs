using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public class CategoryService : ICategoryService
    {
        private readonly ApiContext _context;
        private readonly ILogger<CategoryService> _logger;

        public CategoryService(ApiContext context, ILogger<CategoryService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Category>> GetAllCategoriesAsync()
        {
            return await _context.Categories.ToListAsync();
        }

        public async Task<Category?> GetCategoryByIdAsync(int id)
        {
            return await _context.Categories.FindAsync(id);
        }

        public async Task<int> CreateCategoryAsync(CreateCategoryDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@Name", dto.Name),
                    new SqlParameter("@Description", (object?)dto.Description ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Category_Insert @Name, @Description, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating category: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateCategoryAsync(int id, UpdateCategoryDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@CategoryIDToUpdate", id),
                    new SqlParameter("@Name", dto.Name),
                    new SqlParameter("@Description", (object?)dto.Description ?? DBNull.Value),
                    new SqlParameter("@IsActive", dto.IsActive),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Category_Update @CategoryIDToUpdate, @Name, @Description, @IsActive, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating category: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteCategoryAsync(int id, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@CategoryIDToDelete", id),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Category_Delete @CategoryIDToDelete, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting category: {ex.Message}");
                return false;
            }
        }
    }
}
