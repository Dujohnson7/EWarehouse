using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class WarehousesController : ControllerBase
    {
        private readonly IWarehouseService _warehouseService;
        private readonly ILogger<WarehousesController> _logger;

        public WarehousesController(IWarehouseService warehouseService, ILogger<WarehousesController> logger)
        {
            _warehouseService = warehouseService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllWarehouses()
        {
            try
            {
                var warehouses = await _warehouseService.GetAllWarehousesAsync();
                return Ok(warehouses);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting warehouses: {ex.Message}");
                return BadRequest(new { message = "Failed to get warehouses", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetWarehouseById(int id)
        {
            try
            {
                var warehouse = await _warehouseService.GetWarehouseByIdAsync(id);
                if (warehouse == null)
                    return NotFound(new { message = "Warehouse not found" });
                return Ok(warehouse);
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error getting warehouse: {ex.Message}");
                return BadRequest(new { message = "Failed to get warehouse", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateWarehouse([FromBody] CreateWarehouseDto dto)
        {
            try
            {
                var performingUserId = GetCurrentUserId();
                var result = await _warehouseService.CreateWarehouseAsync(dto, performingUserId);
                return Ok(new { message = "Warehouse created successfully", warehouseId = result });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error creating warehouse: {ex.Message}");
                return BadRequest(new { message = "Failed to create warehouse", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateWarehouse(int id, [FromBody] UpdateWarehouseDto dto)
        {
            try
            {
                var performingUserId = GetCurrentUserId();
                var result = await _warehouseService.UpdateWarehouseAsync(id, dto, performingUserId);
                if (!result)
                    return NotFound(new { message = "Warehouse not found" });
                return Ok(new { message = "Warehouse updated successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error updating warehouse: {ex.Message}");
                return BadRequest(new { message = "Failed to update warehouse", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteWarehouse(int id)
        {
            try
            {
                var performingUserId = GetCurrentUserId();
                var result = await _warehouseService.DeleteWarehouseAsync(id, performingUserId);
                if (!result)
                    return NotFound(new { message = "Warehouse not found" });
                return Ok(new { message = "Warehouse deleted successfully" });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error deleting warehouse: {ex.Message}");
                return BadRequest(new { message = "Failed to delete warehouse", error = ex.Message });
            }
        }
    }
}
