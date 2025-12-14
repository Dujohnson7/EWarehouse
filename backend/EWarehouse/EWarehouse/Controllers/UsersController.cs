using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize] // Uncomment when ready to enforce authentication
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1;  
        }

        /// <summary>
        /// Get all active users
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllUsers()
        {
            try
            {
                var users = await _userService.GetAllUsersAsync();
                return Ok(users);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting users: {ex.Message}");
                return BadRequest(new { message = "Failed to get users", error = ex.Message });
            }
        }

        /// <summary>
        /// Get user by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            try
            {
                var user = await _userService.GetUserByIdAsync(id);
                
                if (user == null)
                    return NotFound(new { message = "User not found" });

                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting user: {ex.Message}");
                return BadRequest(new { message = "Failed to get user", error = ex.Message });
            }
        }

        /// <summary>
        /// Create new user
        /// </summary>
        [HttpPost]
        public async Task<IActionResult> CreateUser([FromBody] CreateUserDto dto)
        {
            try
            {
                var performingUserId = GetCurrentUserId();
                var result = await _userService.CreateUserAsync(dto, performingUserId);
                return Ok(new { message = "User created successfully", userId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating user: {ex.Message}");
                return BadRequest(new { message = "Failed to create user", error = ex.Message });
            }
        }

        /// <summary>
        /// Update existing user
        /// </summary>
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UpdateUserDto dto)
        {
            try
            {
                var performingUserId = GetCurrentUserId();
                var result = await _userService.UpdateUserAsync(id, dto, performingUserId);
                
                if (!result)
                    return NotFound(new { message = "User not found" });

                return Ok(new { message = "User updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating user: {ex.Message}");
                return BadRequest(new { message = "Failed to update user", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete user (soft delete - sets IsActive to false)
        /// </summary>
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            try
            {
                var performingUserId = GetCurrentUserId();
                var result = await _userService.DeleteUserAsync(id, performingUserId);
                
                if (!result)
                    return NotFound(new { message = "User not found" });

                return Ok(new { message = "User deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting user: {ex.Message}");
                return BadRequest(new { message = "Failed to delete user", error = ex.Message });
            }
        }
    }
}
