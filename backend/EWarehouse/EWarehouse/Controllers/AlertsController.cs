using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AlertsController : ControllerBase
    {
        private readonly IAlertService _alertService;
        private readonly ILogger<AlertsController> _logger;

        public AlertsController(IAlertService alertService, ILogger<AlertsController> logger)
        {
            _alertService = alertService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllAlerts()
        {
            try
            {
                var alerts = await _alertService.GetAllAlertsAsync();
                return Ok(alerts);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get alerts", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAlertById(int id)
        {
            try
            {
                var alert = await _alertService.GetAlertByIdAsync(id);
                if (alert == null) return NotFound(new { message = "Alert not found" });
                return Ok(alert);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get alert", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateAlert([FromBody] CreateAlertDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _alertService.CreateAlertAsync(dto, userId);
                return Ok(new { message = "Alert created successfully", alertId = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create alert", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAlert(int id, [FromBody] UpdateAlertDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _alertService.UpdateAlertAsync(id, dto, userId);
                if (!result) return NotFound(new { message = "Alert not found" });
                return Ok(new { message = "Alert updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to update alert", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAlert(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _alertService.DeleteAlertAsync(id, userId);
                if (!result) return NotFound(new { message = "Alert not found" });
                return Ok(new { message = "Alert deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to delete alert", error = ex.Message });
            }
        }

        // POST: api/Alerts/generate-automatic
        [HttpPost("generate-automatic")]
        public async Task<IActionResult> GenerateAutomaticAlerts()
        {
            try
            {
                var alertsGenerated = await _alertService.GenerateAutomaticAlertsAsync();
                return Ok(new { 
                    message = $"Successfully generated {alertsGenerated} automatic alerts",
                    count = alertsGenerated
                });
            }
            catch (Exception ex)
            {
                _logger.LogError($"Error generating automatic alerts: {ex.Message}");
                return StatusCode(500, new { message = "Error generating automatic alerts" });
            }
        }
    }
}
