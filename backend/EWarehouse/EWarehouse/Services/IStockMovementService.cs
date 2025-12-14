using EWarehouse.DTOs;

namespace EWarehouse.Services
{
    public interface IStockMovementService
    {
        // Stock IN
        Task<int> CreateStockInAsync(StockInDto dto, int performingUserID);
        Task<bool> UpdateStockInAsync(int movementID, UpdateStockInDto dto, int performingUserID);
        Task<bool> DeleteStockInAsync(int movementID, int performingUserID);

        // Stock OUT
        Task<int> CreateStockOutAsync(StockOutDto dto, int performingUserID);
        Task<bool> UpdateStockOutAsync(int movementID, UpdateStockOutDto dto, int performingUserID);
        Task<bool> DeleteStockOutAsync(int movementID, int performingUserID);

        // Stock ADJUST
        Task<int> CreateStockAdjustAsync(StockAdjustDto dto, int performingUserID);
        Task<bool> UpdateStockAdjustAsync(int movementID, UpdateStockAdjustDto dto, int performingUserID);
        Task<bool> DeleteStockAdjustAsync(int movementID, int performingUserID);

        // Transfer OUT
        Task<int> CreateTransferOutAsync(TransferOutDto dto, int performingUserID);
        Task<bool> UpdateTransferOutAsync(int movementID, UpdateTransferOutDto dto, int performingUserID);
        Task<bool> DeleteTransferOutAsync(int movementID, int performingUserID);

        // Transfer IN
        Task<int> CreateTransferInAsync(TransferInDto dto, int performingUserID);
        Task<bool> UpdateTransferInAsync(int movementID, UpdateTransferInDto dto, int performingUserID);
        Task<bool> DeleteTransferInAsync(int movementID, int performingUserID);

        // Get movements
        Task<List<StockMovementDto>> GetAllMovementsAsync();
        Task<StockMovementDto?> GetMovementByIdAsync(int movementID);
    }
}
