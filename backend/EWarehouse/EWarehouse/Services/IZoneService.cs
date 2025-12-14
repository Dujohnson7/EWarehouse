using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IZoneService
    {
        Task<IEnumerable<Zone>> GetAllZonesAsync();
        Task<Zone?> GetZoneByIdAsync(int id);
        Task<int> CreateZoneAsync(CreateZoneDto dto, int performingUserID);
        Task<bool> UpdateZoneAsync(int id, UpdateZoneDto dto, int performingUserID);
        Task<bool> DeleteZoneAsync(int id, int performingUserID);
    }
}
