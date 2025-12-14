using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IAlertService
    {
        Task<int> GenerateAutomaticAlertsAsync();
        Task<List<Alert>> GetAllAlertsAsync();
        Task<Alert?> GetAlertByIdAsync(int id);
        Task<int> CreateAlertAsync(CreateAlertDto dto, int performingUserID);
        Task<bool> UpdateAlertAsync(int id, UpdateAlertDto dto, int performingUserID);
        Task<bool> DeleteAlertAsync(int id, int performingUserID);
    }
}
