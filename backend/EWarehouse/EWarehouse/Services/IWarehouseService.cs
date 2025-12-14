using EWarehouse.DTOs;

namespace EWarehouse.Services
{
    public interface IWarehouseService
    {
        Task<List<WarehouseDto>> GetAllWarehousesAsync();
        Task<WarehouseDto?> GetWarehouseByIdAsync(int warehouseId);
        Task<int> CreateWarehouseAsync(CreateWarehouseDto dto, int performingUserID);
        Task<bool> UpdateWarehouseAsync(int warehouseId, UpdateWarehouseDto dto, int performingUserID);
        Task<bool> DeleteWarehouseAsync(int warehouseId, int performingUserID);
    }
}
