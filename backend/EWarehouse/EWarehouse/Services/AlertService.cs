using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public class AlertService : IAlertService
    {
        private readonly ApiContext _context;
        private readonly ILogger<AlertService> _logger;

        public AlertService(ApiContext context, ILogger<AlertService> logger)
        {
            _context = context;
            _logger = logger;
        }

        // Automatic alerts for low stock and missing locations
        public async Task<int> GenerateAutomaticAlertsAsync()
        {
            int alertsGenerated = 0;

            try
            {
                // Check for low stock (using threshold of 10 units)
                const int lowStockThreshold = 10;
                
                var lowStockProducts = await _context.StockStatuses
                    .Include(ss => ss.Product)
                    .Include(ss => ss.Warehouse)
                    .Where(ss => ss.Quantity < lowStockThreshold && ss.Quantity >= 0)
                    .ToListAsync();

                foreach (var stockStatus in lowStockProducts)
                { 
                    var existingAlert = await _context.Alerts
                        .Where(a => a.AlertType == "Low Stock" 
                                 && a.Message.Contains(stockStatus.Product.ProductName)
                                 && a.Message.Contains(stockStatus.Warehouse.Name)
                                 && !a.IsAcknowledged)
                        .FirstOrDefaultAsync();

                    if (existingAlert == null)
                    {
                        var alert = new Alert
                        {
                            AlertType = "Low Stock",
                            Message = $"Low stock alert: {stockStatus.Product.ProductName} in {stockStatus.Warehouse.Name}. Current quantity: {stockStatus.Quantity}",
                            IsAcknowledged = false,
                            CreatedAt = DateTime.Now
                        };

                        _context.Alerts.Add(alert);
                        alertsGenerated++;
                    }
                }

                // Products without location
                var productsWithoutLocation = await _context.Products
                    .Where(p => !_context.ProductLocations.Any(pl => pl.ProductID == p.ProductID))
                    .ToListAsync();

                foreach (var product in productsWithoutLocation)
                { 
                    var existingAlert = await _context.Alerts
                        .Where(a => a.AlertType == "Missing Location"
                                 && a.Message.Contains(product.ProductName)
                                 && !a.IsAcknowledged)
                        .FirstOrDefaultAsync();

                    if (existingAlert == null)
                    {
                        var alert = new Alert
                        {
                            AlertType = "Missing Location",
                            Message = $"Product '{product.ProductName}' has no assigned bin location",
                            IsAcknowledged = false,
                            CreatedAt = DateTime.Now
                        };

                        _context.Alerts.Add(alert);
                        alertsGenerated++;
                    }
                }

                if (alertsGenerated > 0)
                {
                    await _context.SaveChangesAsync();
                }

                return alertsGenerated;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating automatic alerts: {ex.Message}");
                throw;
            }
        }

        public async Task<List<Alert>> GetAllAlertsAsync()
        {
            return await _context.Alerts.ToListAsync();
        }

        public async Task<Alert?> GetAlertByIdAsync(int id)
        {
            return await _context.Alerts.FindAsync(id);
        }

        public async Task<int> CreateAlertAsync(CreateAlertDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@AlertType", dto.AlertType),
                    new SqlParameter("@Message", dto.Message),
                    new SqlParameter("@IsAcknowledged", dto.IsAcknowledged),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };
 
                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Alerts_Insert @ProductID, @AlertType, @Message, @IsAcknowledged, @PerformingUserID", parameters);

                return result; 
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating alert: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateAlertAsync(int id, UpdateAlertDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@AlertIDToUpdate", id),
                    new SqlParameter("@ProductID", dto.ProductID),
                    new SqlParameter("@AlertType", dto.AlertType),
                    new SqlParameter("@Message", dto.Message),
                    new SqlParameter("@IsAcknowledged", dto.IsAcknowledged),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Alerts_Update @AlertIDToUpdate, @ProductID, @AlertType, @Message, @IsAcknowledged, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating alert: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteAlertAsync(int id, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@AlertIDToDelete", id),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Alerts_Delete @AlertIDToDelete, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting alert: {ex.Message}");
                return false;
            }
        }
    }
}
