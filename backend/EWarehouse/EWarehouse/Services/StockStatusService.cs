using EWarehouse.Data;
using EWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace EWarehouse.Services
{
    public class StockStatusService : IStockStatusService
    {
        private readonly ApiContext _context;

        public StockStatusService(ApiContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<StockStatus>> GetAllStockStatusAsync()
        {
            return await _context.StockStatuses
                .Include(s => s.Product)
                .Include(s => s.Warehouse)
                .ToListAsync();
        }

        public async Task<StockStatus?> GetStockStatusAsync(int productId, int warehouseId)
        {
            return await _context.StockStatuses
                .Include(s => s.Product)
                .Include(s => s.Warehouse)
                .FirstOrDefaultAsync(s => s.ProductID == productId && s.WarehouseID == warehouseId);
        }

        public async Task<IEnumerable<StockStatus>> GetStockByWarehouseAsync(int warehouseId)
        {
             return await _context.StockStatuses
                .Include(s => s.Product)
                .Where(s => s.WarehouseID == warehouseId)
                .ToListAsync();
        }
    }
}
