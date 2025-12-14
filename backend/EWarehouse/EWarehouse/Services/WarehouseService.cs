using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;

namespace EWarehouse.Services
{
    public class WarehouseService : IWarehouseService
    {
        private readonly ApiContext _context;
        private readonly ILogger<WarehouseService> _logger;

        public WarehouseService(ApiContext context, ILogger<WarehouseService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<WarehouseDto>> GetAllWarehousesAsync()
        {
            try
            {
                var warehouses = await _context.Warehouses
                    .Where(w => w.IsActive)
                    .Select(w => new WarehouseDto
                    {
                        WarehouseID = w.WarehouseID,
                        Name = w.Name,
                        Country = w.Country,
                        Province = w.Province,
                        District = w.District,
                        Address = w.Address,
                        ManagerID = w.ManagerID,
                        IsActive = w.IsActive,
                        CreatedAt = w.CreatedAt
                    })
                    .ToListAsync();

                return warehouses;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting warehouses: {ex.Message}");
                throw;
            }
        }

        public async Task<WarehouseDto?> GetWarehouseByIdAsync(int warehouseId)
        {
            try
            {
                var warehouse = await _context.Warehouses
                    .Where(w => w.WarehouseID == warehouseId)
                    .Select(w => new WarehouseDto
                    {
                        WarehouseID = w.WarehouseID,
                        Name = w.Name,
                        Country = w.Country,
                        Province = w.Province,
                        District = w.District,
                        Address = w.Address,
                        ManagerID = w.ManagerID,
                        IsActive = w.IsActive,
                        CreatedAt = w.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                return warehouse;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting warehouse {warehouseId}: {ex.Message}");
                throw;
            }
        }

        public async Task<int> CreateWarehouseAsync(CreateWarehouseDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@Name", dto.Name),
                    new SqlParameter("@Country", dto.Country),
                    new SqlParameter("@Province", (object?)dto.Province ?? DBNull.Value),
                    new SqlParameter("@District", (object?)dto.District ?? DBNull.Value),
                    new SqlParameter("@Address", (object?)dto.Address ?? DBNull.Value),
                    new SqlParameter("@ManagerID", (object?)dto.ManagerID ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Warehouses_Insert @Name, @Country, @Province, @District, @Address, @ManagerID, @PerformingUserID", parameters);

                _logger.LogInformation($"Warehouse created: {dto.Name}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating warehouse: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateWarehouseAsync(int warehouseId, UpdateWarehouseDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@WarehouseID", warehouseId),
                    new SqlParameter("@Name", dto.Name),
                    new SqlParameter("@Country", dto.Country),
                    new SqlParameter("@Province", (object?)dto.Province ?? DBNull.Value),
                    new SqlParameter("@District", (object?)dto.District ?? DBNull.Value),
                    new SqlParameter("@Address", (object?)dto.Address ?? DBNull.Value),
                    new SqlParameter("@ManagerID", (object?)dto.ManagerID ?? DBNull.Value),
                    new SqlParameter("@IsActive", dto.IsActive),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Warehouses_Update @WarehouseID, @Name, @Country, @Province, @District, @Address, @ManagerID, @IsActive, @PerformingUserID", parameters);

                _logger.LogInformation($"Warehouse updated: {warehouseId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating warehouse {warehouseId}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteWarehouseAsync(int warehouseId, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@WarehouseIDToDelete", warehouseId),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Warehouses_Delete @WarehouseIDToDelete, @PerformingUserID", parameters);

                _logger.LogInformation($"Warehouse deleted: {warehouseId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting warehouse {warehouseId}: {ex.Message}");
                return false;
            }
        }
    }
}
