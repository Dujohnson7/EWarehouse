using EWarehouse.DTOs;
using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IUserService
    {
        Task<List<UserDto>> GetAllUsersAsync();
        Task<UserDto?> GetUserByIdAsync(int userId);
        Task<int> CreateUserAsync(CreateUserDto dto, int performingUserID);
        Task<bool> UpdateUserAsync(int userId, UpdateUserDto dto, int performingUserID);
        Task<bool> DeleteUserAsync(int userId, int performingUserID);
    }
}
