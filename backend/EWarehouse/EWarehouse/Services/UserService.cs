using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using EWarehouse.Data;
using EWarehouse.DTOs;

namespace EWarehouse.Services
{
    public class UserService : IUserService
    {
        private readonly ApiContext _context;
        private readonly ILogger<UserService> _logger;

        public UserService(ApiContext context, ILogger<UserService> logger)
        {
            _context = context;
            _logger = logger;
        }

        public async Task<List<UserDto>> GetAllUsersAsync()
        {
            try
            {
                var users = await _context.Users
                    .Where(u => u.IsActive)
                    .Select(u => new UserDto
                    {
                        UserID = u.UserID,
                        UserProfile = u.UserProfile,
                        FullName = u.FullName,
                        Email = u.Email,
                        Role = u.Role,
                        WarehouseID = u.WarehouseID,
                        isUpdate = u.isUpdate,
                        isInsert = u.isInsert,
                        isDelete = u.isDelete,
                        IsActive = u.IsActive,
                        CreatedAt = u.CreatedAt
                    })
                    .ToListAsync();

                return users;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting users: {ex.Message}");
                throw;
            }
        }

        public async Task<UserDto?> GetUserByIdAsync(int userId)
        {
            try
            {
                var user = await _context.Users
                    .Where(u => u.UserID == userId)
                    .Select(u => new UserDto
                    {
                        UserID = u.UserID,
                        UserProfile = u.UserProfile,
                        FullName = u.FullName,
                        Email = u.Email,
                        Role = u.Role,
                        WarehouseID = u.WarehouseID,
                        isUpdate = u.isUpdate,
                        isInsert = u.isInsert,
                        isDelete = u.isDelete,
                        IsActive = u.IsActive,
                        CreatedAt = u.CreatedAt
                    })
                    .FirstOrDefaultAsync();

                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user {userId}: {ex.Message}");
                throw;
            }
        }

        public async Task<int> CreateUserAsync(CreateUserDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@FullName", dto.FullName),
                    new SqlParameter("@Email", dto.Email),
                    new SqlParameter("@Password", dto.Password),
                    new SqlParameter("@Role", dto.Role),
                    new SqlParameter("@WarehouseID", (object?)dto.WarehouseID ?? DBNull.Value),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                var result = await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Users_Insert @FullName, @Email, @Password, @Role, @WarehouseID, @PerformingUserID", parameters);

                _logger.LogInformation($"User created: {dto.Email}");
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating user: {ex.Message}");
                throw;
            }
        }

        public async Task<bool> UpdateUserAsync(int userId, UpdateUserDto dto, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@UserIDToUpdate", userId),
                    new SqlParameter("@FullName", dto.FullName),
                    new SqlParameter("@Email", dto.Email),
                    new SqlParameter("@Password", dto.Password ?? string.Empty),
                    new SqlParameter("@Role", dto.Role),
                    new SqlParameter("@WarehouseID", (object?)dto.WarehouseID ?? DBNull.Value),
                    new SqlParameter("@isUpdate", dto.isUpdate),
                    new SqlParameter("@isInsert", dto.isInsert),
                    new SqlParameter("@isDelete", dto.isDelete),
                    new SqlParameter("@IsActive", dto.IsActive),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Users_Update @UserIDToUpdate, @FullName, @Email, @Password, @Role, @WarehouseID, @isUpdate, @isInsert, @isDelete, @IsActive, @PerformingUserID", parameters);

                _logger.LogInformation($"User updated: {userId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating user {userId}: {ex.Message}");
                return false;
            }
        }

        public async Task<bool> DeleteUserAsync(int userId, int performingUserID)
        {
            try
            {
                var parameters = new[]
                {
                    new SqlParameter("@UserIDToDelete", userId),
                    new SqlParameter("@PerformingUserID", performingUserID)
                };

                await _context.Database
                    .ExecuteSqlRawAsync("EXEC usp_Users_Delete @UserIDToDelete, @PerformingUserID", parameters);

                _logger.LogInformation($"User deleted: {userId}");
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting user {userId}: {ex.Message}");
                return false;
            }
        }
    }
}
