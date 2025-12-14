using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public class ZoneService : IZoneService
    {
        private readonly ApiContext _context;
        private readonly ILogger<ZoneService> _logger;

        public ZoneService(ApiContext context, ILogger<ZoneService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Zone>> GetAllZonesAsync()
        {
            return await _context.Zones.Include(z => z.Warehouse).ToListAsync();
        }

        public async Task<Zone?> GetZoneByIdAsync(int id)
        {
            return await _context.Zones.Include(z => z.Warehouse).FirstOrDefaultAsync(z => z.ZoneID == id);
        }

        public async Task<int> CreateZoneAsync(CreateZoneDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@ZoneName", dto.ZoneName),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Zones_Insert @WarehouseID, @ZoneName, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating zone: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateZoneAsync(int id, UpdateZoneDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ZoneIDToUpdate", id),
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@ZoneName", dto.ZoneName),
                    new SqlParameter("@IsActive", dto.IsActive),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Zones_Update @ZoneIDToUpdate, @WarehouseID, @ZoneName, @IsActive, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating zone: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteZoneAsync(int id, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@ZoneIDToDelete", id),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Zones_Delete @ZoneIDToDelete, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                 _logger.LogError($"Error deleting zone: {ex.Message}");
                return false;
            }
        }
    }
}
