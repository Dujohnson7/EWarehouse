using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IBinService
    {
        Task<IEnumerable<Bin>> GetAllBinsAsync();
        Task<Bin?> GetBinByCodeAsync(string code);
        Task<int> CreateBinAsync(CreateBinDto dto, int performingUserID);
        Task<bool> UpdateBinAsync(string code, UpdateBinDto dto, int performingUserID);
        Task<bool> DeleteBinAsync(string code, int performingUserID);
    }
}
