using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ZonesController : ControllerBase
    {
        private readonly IZoneService _zoneService;
        private readonly ILogger<ZonesController> _logger;

        public ZonesController(IZoneService zoneService, ILogger<ZonesController> logger)
        {
            _zoneService = zoneService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllZones()
        {
            try
            {
                var zones = await _zoneService.GetAllZonesAsync();
                return Ok(zones);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get zones", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetZoneById(int id)
        {
            try
            {
                var zone = await _zoneService.GetZoneByIdAsync(id);
                if (zone == null) return NotFound(new { message = "Zone not found" });
                return Ok(zone);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get zone", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateZone([FromBody] CreateZoneDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _zoneService.CreateZoneAsync(dto, userId);
                return Ok(new { message = "Zone created successfully", zoneId = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create zone", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateZone(int id, [FromBody] UpdateZoneDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _zoneService.UpdateZoneAsync(id, dto, userId);
                if (!result) return NotFound(new { message = "Zone not found" });
                return Ok(new { message = "Zone updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to update zone", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteZone(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _zoneService.DeleteZoneAsync(id, userId);
                if (!result) return NotFound(new { message = "Zone not found" });
                return Ok(new { message = "Zone deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to delete zone", error = ex.Message });
            }
        }
    }
}
