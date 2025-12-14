using EWarehouse.Services;
using Microsoft.AspNetCore.Mvc;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StockStatusController : ControllerBase
    {
        private readonly IStockStatusService _stockStatusService;

        public StockStatusController(IStockStatusService stockStatusService)
        {
            _stockStatusService = stockStatusService;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var status = await _stockStatusService.GetAllStockStatusAsync();
            return Ok(status);
        }

        [HttpGet("warehouse/{warehouseId}")]
        public async Task<IActionResult> GetByWarehouse(int warehouseId)
        {
            var status = await _stockStatusService.GetStockByWarehouseAsync(warehouseId);
            return Ok(status);
        }

        [HttpGet("{productId}/{warehouseId}")]
        public async Task<IActionResult> GetSpecific(int productId, int warehouseId)
        {
            var status = await _stockStatusService.GetStockStatusAsync(productId, warehouseId);
            if (status == null) return NotFound(new { message = "Stock status not found" });
            return Ok(status);
        }
    }
}
