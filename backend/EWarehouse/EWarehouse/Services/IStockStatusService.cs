using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IStockStatusService
    {
        Task<IEnumerable<StockStatus>> GetAllStockStatusAsync();
        Task<StockStatus?> GetStockStatusAsync(int productId, int warehouseId);
        Task<IEnumerable<StockStatus>> GetStockByWarehouseAsync(int warehouseId);
    }
}
