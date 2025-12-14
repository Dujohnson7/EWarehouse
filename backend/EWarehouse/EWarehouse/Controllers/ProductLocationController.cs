using EWarehouse.Models;
using EWarehouse.Services;
using Microsoft.AspNetCore.Mvc;

using EWarehouse.Models.DTOs;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductLocationsController : ControllerBase
    {
        private readonly IProductLocationService _service;

        public ProductLocationsController(IProductLocationService service)
        {
            _service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var items = await _service.GetAllLocationsAsync();
            // Map to anonymous objects that include product and bin details using camelCase
            var result = items.Select(i => new
            {
                productLocationID = i.ProductLocationID,
                productID = i.ProductID,
                binID = i.BinID,
                quantity = i.Quantity,
                assignedAt = i.AssignedAt,
                product = i.Product != null ? new
                {
                    productID = i.Product.ProductID,
                    productName = i.Product.ProductName,
                    categoryID = i.Product.CategoryID
                } : null,
                bin = i.Bin != null ? new
                {
                    binCode = i.Bin.BinCode, 
                    warehouseID = i.Bin.WarehouseID,
                    zoneID = i.Bin.ZoneID
                } : null
            });
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var item = await _service.GetLocationByIdAsync(id);
            if (item == null) return NotFound();
            
            var result = new
            {
                productLocationID = item.ProductLocationID,
                productID = item.ProductID,
                binID = item.BinID,
                quantity = item.Quantity,
                assignedAt = item.AssignedAt,
                product = item.Product != null ? new
                {
                    productID = item.Product.ProductID,
                    productName = item.Product.ProductName,
                    categoryID = item.Product.CategoryID
                } : null,
                bin = item.Bin != null ? new
                {
                    binCode = item.Bin.BinCode, 
                    warehouseID = item.Bin.WarehouseID,
                    zoneID = item.Bin.ZoneID
                } : null
            };
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create(ProductLocationDto dto)
        {
            var location = new ProductLocation
            {
                ProductID = dto.ProductID,
                BinID = dto.BinID,
                Quantity = dto.Quantity
            };
            
            var created = await _service.CreateLocationAsync(location);
            
            // Map back to DTO for response
            var resultDto = new ProductLocationDto
            {
                ProductLocationID = created.ProductLocationID,
                ProductID = created.ProductID,
                BinID = created.BinID,
                Quantity = created.Quantity,
                AssignedAt = created.AssignedAt
            };
            
            return CreatedAtAction(nameof(GetById), new { id = created.ProductLocationID }, resultDto);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, ProductLocationDto dto)
        {
            if (id != dto.ProductLocationID && dto.ProductLocationID != 0) return BadRequest("ID Mismatch");
            
            // Allow simplified DTO where ID might be 0 but URL ID is correct
            dto.ProductLocationID = id; 

            var location = new ProductLocation
            {
                ProductLocationID = id,
                ProductID = dto.ProductID,
                BinID = dto.BinID,
                Quantity = dto.Quantity
            };

            var updated = await _service.UpdateLocationAsync(location);
            if (updated == null) return NotFound();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _service.DeleteLocationAsync(id);
            if (!result) return NotFound();
            return NoContent();
        }
    }
}
