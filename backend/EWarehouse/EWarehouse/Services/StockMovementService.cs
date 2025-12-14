using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;
using EWarehouse.Data;
using EWarehouse.DTOs;

namespace EWarehouse.Services
{
    public class StockMovementService : IStockMovementService
    {
        private readonly ApiContext _context;
        private readonly ILogger<StockMovementService> _logger;

        public StockMovementService(ApiContext context, ILogger<StockMovementService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Stock IN Operations
        public async Task<int> CreateStockInAsync(StockInDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@PerformingUserID", performingUserID),
                    new SqlParameter("@ToBinID", (object?)dto.ToBinID ?? DBNull.Value),
                    new SqlParameter("@Quantity", dto.Quantity)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Insert_IN @ProductID, @WarehouseID, @PerformingUserID, @ToBinID, @Quantity", parameters);

                _logger.LogInformation($"Stock IN created for Product {dto.ProductID}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Stock IN: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateStockInAsync(int movementID, UpdateStockInDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@NewQuantity", dto.NewQuantity),
                    new SqlParameter("@ToBinID", (object?)dto.ToBinID ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Update_IN @MovementID, @NewQuantity, @ToBinID, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Stock IN: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteStockInAsync(int movementID, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Delete_IN @MovementID, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Stock IN: {ex.Message}");
                return false;
            }
        }

        // Stock OUT Operations
        public async Task<int> CreateStockOutAsync(StockOutDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@FromBinID", (object?)dto.FromBinID ?? DBNull.Value),
                    new SqlParameter("@Quantity", dto.Quantity),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Insert_OUT @ProductID, @WarehouseID, @FromBinID, @Quantity, @Reason, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Stock OUT: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateStockOutAsync(int movementID, UpdateStockOutDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@NewQuantity", dto.NewQuantity),
                    new SqlParameter("@FromBinID", (object?)dto.FromBinID ?? DBNull.Value),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Update_OUT @MovementID, @NewQuantity, @FromBinID, @Reason, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Stock OUT: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteStockOutAsync(int movementID, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Delete_OUT @MovementID, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Stock OUT: {ex.Message}");
                return false;
            }
        }

        // Stock ADJUST Operations
        public async Task<int> CreateStockAdjustAsync(StockAdjustDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@PerformingUserID", performingUserID),
                    new SqlParameter("@FromBinID", (object?)dto.FromBinID ?? DBNull.Value),
                    new SqlParameter("@Quantity", dto.Quantity),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Insert_ADJUST @ProductID, @WarehouseID, @PerformingUserID, @FromBinID, @Quantity, @Reason", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Stock ADJUST: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateStockAdjustAsync(int movementID, UpdateStockAdjustDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@NewQuantity", dto.NewQuantity),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Update_ADJUST @MovementID, @NewQuantity, @Reason, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Stock ADJUST: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteStockAdjustAsync(int movementID, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Delete_ADJUST @MovementID, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Stock ADJUST: {ex.Message}");
                return false;
            }
        }

        // Transfer OUT Operations
        public async Task<int> CreateTransferOutAsync(TransferOutDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@WarehouseID_IN", dto.WarehouseID_IN),
                    new SqlParameter("@WarehouseID_OUT", dto.WarehouseID_OUT),
                    new SqlParameter("@FromBinID", dto.FromBinID),
                    new SqlParameter("@Quantity", dto.Quantity),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@TransferCode", dto.TransferCode),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Insert_Transfer_Out @ProductID, @WarehouseID_IN, @WarehouseID_OUT, @FromBinID, @Quantity, @Reason, @TransferCode, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Transfer OUT: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateTransferOutAsync(int movementID, UpdateTransferOutDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@NewQuantity", dto.NewQuantity),
                    new SqlParameter("@FromBinID", dto.FromBinID),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Update_Transfer_Out @MovementID, @NewQuantity, @FromBinID, @Reason, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Transfer OUT: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteTransferOutAsync(int movementID, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Delete_Transfer_Out @MovementID, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Transfer OUT: {ex.Message}");
                return false;
            }
        }

        // Transfer IN Operations
        public async Task<int> CreateTransferInAsync(TransferInDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@WarehouseID_IN", dto.WarehouseID_IN),
                    new SqlParameter("@UserID", dto.UserID),
                    new SqlParameter("@FromBinID", dto.FromBinID),
                    new SqlParameter("@ToBinID", dto.ToBinID),
                    new SqlParameter("@Quantity", dto.Quantity),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@TransferCode", dto.TransferCode),
                    new SqlParameter("@TransferStatus", 0),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Insert_Transfer_In @ProductID, @WarehouseID_IN, @UserID, @FromBinID, @ToBinID, @Quantity, @Reason, @TransferCode, @TransferStatus, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Transfer IN: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateTransferInAsync(int movementID, UpdateTransferInDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@NewQuantity", dto.NewQuantity),
                    new SqlParameter("@ToBinID", dto.ToBinID),
                    new SqlParameter("@Reason", (object?)dto.Reason ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Update_Transfer_In @MovementID, @NewQuantity, @ToBinID, @Reason, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Transfer IN: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteTransferInAsync(int movementID, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@MovementID", movementID),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_StockMovements_Delete_Transfer_In @MovementID, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Transfer IN: {ex.Message}");
                return false;
            }
        }

        // Get Operations
        public async Task<List<StockMovementDto>> GetAllMovementsAsync()
        {
            var movements = await _context.StockMovements
                .Include(sm => sm.Product)
                    .ThenInclude(p => p.Category)
                .Include(sm => sm.User)
                .Include(sm => sm.Warehouse)
                .Select(sm => new StockMovementDto
                {
                    MovementID = sm.MovementID,
                    ProductID = sm.ProductID,
                    WarehouseID = sm.WarehouseID,
                    UserID = sm.UserID,
                    MovementType = sm.MovementType,
                    FromBinID = sm.FromBinID,
                    ToBinID = sm.ToBinID,
                    Quantity = sm.Quantity,
                    Reason = sm.Reason,
                    CreatedAt = sm.CreatedAt,
                    TransferCode = sm.TransferCode,
                    TransferStatus = sm.TransferStatus,
                    Product = sm.Product != null ? new ProductDto
                    {
                        ProductID = sm.Product.ProductID,
                        ProductName = sm.Product.ProductName,
                        SKU = sm.Product.SKU,
                        CategoryID = sm.Product.CategoryID,
                        Price = sm.Product.Price,
                        Description = sm.Product.Description,
                        Image = sm.Product.Image,
                        IsActive = sm.Product.IsActive,
                        CreatedAt = sm.Product.CreatedAt
                    } : null,
                    User = sm.User != null ? new UserDto
                    {
                        UserID = sm.User.UserID,
                        FullName = sm.User.FullName,
                        Email = sm.User.Email,
                        Role = sm.User.Role,
                        WarehouseID = sm.User.WarehouseID,
                        IsActive = sm.User.IsActive
                    } : null,
                    Warehouse = sm.Warehouse != null ? new WarehouseDto
                    {
                        WarehouseID = sm.Warehouse.WarehouseID,
                        Name = sm.Warehouse.Name,
                        Country = sm.Warehouse.Country,
                        Province = sm.Warehouse.Province,
                        District = sm.Warehouse.District,
                        Address = sm.Warehouse.Address,
                        ManagerID = sm.Warehouse.ManagerID,
                        IsActive = sm.Warehouse.IsActive
                    } : null
                })
                .ToListAsync();

            return movements;
        }

        public async Task<StockMovementDto?> GetMovementByIdAsync(int movementID)
        {
            var movement = await _context.StockMovements
                .Where(sm => sm.MovementID == movementID)
                .Select(sm => new StockMovementDto
                {
                    MovementID = sm.MovementID,
                    ProductID = sm.ProductID,
                    WarehouseID = sm.WarehouseID,
                    UserID = sm.UserID,
                    MovementType = sm.MovementType,
                    FromBinID = sm.FromBinID,
                    ToBinID = sm.ToBinID,
                    Quantity = sm.Quantity,
                    Reason = sm.Reason,
                    CreatedAt = sm.CreatedAt,
                    TransferCode = sm.TransferCode,
                    TransferStatus = sm.TransferStatus
                })
                .FirstOrDefaultAsync();

            return movement;
        }
    }
}
