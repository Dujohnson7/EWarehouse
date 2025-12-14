using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize] // Uncomment when JWT authentication is fully configured
    public class StockMovementsController : ControllerBase
    {
        private readonly IStockMovementService _stockMovementService;
        private readonly ILogger<StockMovementsController> _logger;

        public StockMovementsController(IStockMovementService stockMovementService, ILogger<StockMovementsController> logger)
        {
            _stockMovementService = stockMovementService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            // Get user ID from JWT claims
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1; // Default to 1 for testing
        }

        // ==================== Stock IN ====================

        /// <summary>
        /// Create Stock IN movement
        /// </summary>
        [HttpPost("in")]
        public async Task<IActionResult> CreateStockIn([FromBody] StockInDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.CreateStockInAsync(dto, userId);
                return Ok(new { message = "Stock IN created successfully", movementId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Stock IN: {ex.Message}");
                return BadRequest(new { message = "Failed to create Stock IN", error = ex.Message });
            }
        }

        /// <summary>
        /// Update Stock IN movement
        /// </summary>
        [HttpPut("in/{id}")]
        public async Task<IActionResult> UpdateStockIn(int id, [FromBody] UpdateStockInDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.UpdateStockInAsync(id, dto, userId);
                
                if (!result)
                    return NotFound(new { message = "Stock IN movement not found" });

                return Ok(new { message = "Stock IN updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Stock IN: {ex.Message}");
                return BadRequest(new { message = "Failed to update Stock IN", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete Stock IN movement
        /// </summary>
        [HttpDelete("in/{id}")]
        public async Task<IActionResult> DeleteStockIn(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.DeleteStockInAsync(id, userId);
                
                if (!result)
                    return NotFound(new { message = "Stock IN movement not found" });

                return Ok(new { message = "Stock IN deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Stock IN: {ex.Message}");
                return BadRequest(new { message = "Failed to delete Stock IN", error = ex.Message });
            }
        }

        // ==================== Stock OUT ====================

        /// <summary>
        /// Create Stock OUT movement
        /// </summary>
        [HttpPost("out")]
        public async Task<IActionResult> CreateStockOut([FromBody] StockOutDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.CreateStockOutAsync(dto, userId);
                return Ok(new { message = "Stock OUT created successfully", movementId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Stock OUT: {ex.Message}");
                return BadRequest(new { message = "Failed to create Stock OUT", error = ex.Message });
            }
        }

        /// <summary>
        /// Update Stock OUT movement
        /// </summary>
        [HttpPut("out/{id}")]
        public async Task<IActionResult> UpdateStockOut(int id, [FromBody] UpdateStockOutDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.UpdateStockOutAsync(id, dto, userId);
                
                if (!result)
                    return NotFound(new { message = "Stock OUT movement not found" });

                return Ok(new { message = "Stock OUT updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Stock OUT: {ex.Message}");
                return BadRequest(new { message = "Failed to update Stock OUT", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete Stock OUT movement
        /// </summary>
        [HttpDelete("out/{id}")]
        public async Task<IActionResult> DeleteStockOut(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.DeleteStockOutAsync(id, userId);
                
                if (!result)
                    return NotFound(new { message = "Stock OUT movement not found" });

                return Ok(new { message = "Stock OUT deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Stock OUT: {ex.Message}");
                return BadRequest(new { message = "Failed to delete Stock OUT", error = ex.Message });
            }
        }

        // ==================== Stock ADJUST ====================

        /// <summary>
        /// Create Stock ADJUST movement
        /// </summary>
        [HttpPost("adjust")]
        public async Task<IActionResult> CreateStockAdjust([FromBody] StockAdjustDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.CreateStockAdjustAsync(dto, userId);
                return Ok(new { message = "Stock ADJUST created successfully", movementId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Stock ADJUST: {ex.Message}");
                return BadRequest(new { message = "Failed to create Stock ADJUST", error = ex.Message });
            }
        }

        /// <summary>
        /// Update Stock ADJUST movement
        /// </summary>
        [HttpPut("adjust/{id}")]
        public async Task<IActionResult> UpdateStockAdjust(int id, [FromBody] UpdateStockAdjustDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.UpdateStockAdjustAsync(id, dto, userId);
                
                if (!result)
                    return NotFound(new { message = "Stock ADJUST movement not found" });

                return Ok(new { message = "Stock ADJUST updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Stock ADJUST: {ex.Message}");
                return BadRequest(new { message = "Failed to update Stock ADJUST", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete Stock ADJUST movement
        /// </summary>
        [HttpDelete("adjust/{id}")]
        public async Task<IActionResult> DeleteStockAdjust(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.DeleteStockAdjustAsync(id, userId);
                
                if (!result)
                    return NotFound(new { message = "Stock ADJUST movement not found" });

                return Ok(new { message = "Stock ADJUST deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Stock ADJUST: {ex.Message}");
                return BadRequest(new { message = "Failed to delete Stock ADJUST", error = ex.Message });
            }
        }

        // ==================== Transfer OUT ====================

        /// <summary>
        /// Create Transfer OUT movement
        /// </summary>
        [HttpPost("transfer-out")]
        public async Task<IActionResult> CreateTransferOut([FromBody] TransferOutDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.CreateTransferOutAsync(dto, userId);
                return Ok(new { message = "Transfer OUT created successfully", movementId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Transfer OUT: {ex.Message}");
                return BadRequest(new { message = "Failed to create Transfer OUT", error = ex.Message });
            }
        }

        /// <summary>
        /// Update Transfer OUT movement
        /// </summary>
        [HttpPut("transfer-out/{id}")]
        public async Task<IActionResult> UpdateTransferOut(int id, [FromBody] UpdateTransferOutDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.UpdateTransferOutAsync(id, dto, userId);
                
                if (!result)
                    return NotFound(new { message = "Transfer OUT movement not found" });

                return Ok(new { message = "Transfer OUT updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Transfer OUT: {ex.Message}");
                return BadRequest(new { message = "Failed to update Transfer OUT", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete Transfer OUT movement
        /// </summary>
        [HttpDelete("transfer-out/{id}")]
        public async Task<IActionResult> DeleteTransferOut(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.DeleteTransferOutAsync(id, userId);
                
                if (!result)
                    return NotFound(new { message = "Transfer OUT movement not found" });

                return Ok(new { message = "Transfer OUT deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Transfer OUT: {ex.Message}");
                return BadRequest(new { message = "Failed to delete Transfer OUT", error = ex.Message });
            }
        }

        // ==================== Transfer IN ====================

        /// <summary>
        /// Create Transfer IN movement
        /// </summary>
        [HttpPost("transfer-in")]
        public async Task<IActionResult> CreateTransferIn([FromBody] TransferInDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.CreateTransferInAsync(dto, userId);
                return Ok(new { message = "Transfer IN created successfully", movementId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating Transfer IN: {ex.Message}");
                return BadRequest(new { message = "Failed to create Transfer IN", error = ex.Message });
            }
        }

        /// <summary>
        /// Update Transfer IN movement
        /// </summary>
        [HttpPut("transfer-in/{id}")]
        public async Task<IActionResult> UpdateTransferIn(int id, [FromBody] UpdateTransferInDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.UpdateTransferInAsync(id, dto, userId);
                
                if (!result)
                    return NotFound(new { message = "Transfer IN movement not found" });

                return Ok(new { message = "Transfer IN updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating Transfer IN: {ex.Message}");
                return BadRequest(new { message = "Failed to update Transfer IN", error = ex.Message });
            }
        }

        /// <summary>
        /// Delete Transfer IN movement
        /// </summary>
        [HttpDelete("transfer-in/{id}")]
        public async Task<IActionResult> DeleteTransferIn(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _stockMovementService.DeleteTransferInAsync(id, userId);
                
                if (!result)
                    return NotFound(new { message = "Transfer IN movement not found" });

                return Ok(new { message = "Transfer IN deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting Transfer IN: {ex.Message}");
                return BadRequest(new { message = "Failed to delete Transfer IN", error = ex.Message });
            }
        }

        // ==================== Get Operations ====================

        /// <summary>
        /// Get all stock movements
        /// </summary>
        [HttpGet]
        public async Task<IActionResult> GetAllMovements()
        {
            try
            {
                var movements = await _stockMovementService.GetAllMovementsAsync();
                return Ok(movements);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting movements: {ex.Message}");
                return BadRequest(new { message = "Failed to get movements", error = ex.Message });
            }
        }

        /// <summary>
        /// Get stock movement by ID
        /// </summary>
        [HttpGet("{id}")]
        public async Task<IActionResult> GetMovementById(int id)
        {
            try
            {
                var movement = await _stockMovementService.GetMovementByIdAsync(id);
                
                if (movement == null)
                    return NotFound(new { message = "Movement not found" });

                return Ok(movement);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting movement: {ex.Message}");
                return BadRequest(new { message = "Failed to get movement", error = ex.Message });
            }
        }
    }
}
