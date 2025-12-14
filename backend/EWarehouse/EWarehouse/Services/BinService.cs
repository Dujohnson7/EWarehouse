using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public class BinService : IBinService
    {
        private readonly ApiContext _context;
        private readonly ILogger<BinService> _logger;

        public BinService(ApiContext context, ILogger<BinService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<IEnumerable<Bin>> GetAllBinsAsync()
        {
            return await _context.Bins.Include(b => b.Warehouse).Include(b => b.Zone).ToListAsync();
        }

        public async Task<Bin?> GetBinByCodeAsync(string code)
        {
            return await _context.Bins.Include(b => b.Warehouse).Include(b => b.Zone).FirstOrDefaultAsync(b => b.BinCode == code);
        }

        public async Task<int> CreateBinAsync(CreateBinDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@BinCode", dto.BinCode),
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@ZoneID", dto.ZoneID),
                    new SqlParameter("@Capacity", dto.Capacity),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };
                 
                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Bins_Insert @BinCode, @WarehouseID, @ZoneID, @Capacity, @PerformingUserID", parameters);

                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating bin: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateBinAsync(string code, UpdateBinDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@BinCodeToUpdate", code),
                    new SqlParameter("@WarehouseID", dto.WarehouseID),
                    new SqlParameter("@ZoneID", dto.ZoneID),
                    new SqlParameter("@Capacity", dto.Capacity),
                    new SqlParameter("@IsActive", dto.IsActive),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Bins_Update @BinCodeToUpdate, @WarehouseID, @ZoneID, @Capacity, @IsActive, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                 _logger.LogError($"Error updating bin: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteBinAsync(string code, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@BinCodeToDelete", code),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Bins_Delete @BinCodeToDelete, @PerformingUserID", parameters);

                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting bin: {ex.Message}");
                return false;
            }
        }
    }
}
