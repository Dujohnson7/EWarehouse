using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BinsController : ControllerBase
    {
        private readonly IBinService _binService;
        private readonly ILogger<BinsController> _logger;

        public BinsController(IBinService binService, ILogger<BinsController> logger)
        {
            _binService = binService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllBins()
        {
            try
            {
                var bins = await _binService.GetAllBinsAsync();
                return Ok(bins);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get bins", error = ex.Message });
            }
        }

        [HttpGet("{binCode}")]
        public async Task<IActionResult> GetBinByCode(string binCode)
        {
            try
            {
                var bin = await _binService.GetBinByCodeAsync(binCode);
                if (bin == null) return NotFound(new { message = "Bin not found" });
                return Ok(bin);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get bin", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateBin([FromBody] CreateBinDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _binService.CreateBinAsync(dto, userId);
                return Ok(new { message = "Bin created successfully", binCode = dto.BinCode });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create bin", error = ex.Message });
            }
        }

        [HttpPut("{binCode}")]
        public async Task<IActionResult> UpdateBin(string binCode, [FromBody] UpdateBinDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _binService.UpdateBinAsync(binCode, dto, userId);
                if (!result) return NotFound(new { message = "Bin not found" });
                return Ok(new { message = "Bin updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to update bin", error = ex.Message });
            }
        }

        [HttpDelete("{binCode}")]
        public async Task<IActionResult> DeleteBin(string binCode)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _binService.DeleteBinAsync(binCode, userId);
                if (!result) return NotFound(new { message = "Bin not found" });
                return Ok(new { message = "Bin deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to delete bin", error = ex.Message });
            }
        }
    }
}
