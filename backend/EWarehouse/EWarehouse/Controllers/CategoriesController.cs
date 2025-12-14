using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using EWarehouse.DTOs;
using EWarehouse.Services;

namespace EWarehouse.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private readonly ICategoryService _categoryService;
        private readonly ILogger<CategoriesController> _logger;

        public CategoriesController(ICategoryService categoryService, ILogger<CategoriesController> logger)
        {
            _categoryService = categoryService;
            _logger = logger;
        }

        private int GetCurrentUserId()
        {
            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            return int.TryParse(userIdClaim, out var userId) ? userId : 1;
        }

        [HttpGet]
        public async Task<IActionResult> GetAllCategories()
        {
            try
            {
                var categories = await _categoryService.GetAllCategoriesAsync();
                return Ok(categories);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get categories", error = ex.Message });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetCategoryById(int id)
        {
            try
            {
                var category = await _categoryService.GetCategoryByIdAsync(id);
                if (category == null) return NotFound(new { message = "Category not found" });
                return Ok(category);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to get category", error = ex.Message });
            }
        }

        [HttpPost]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _categoryService.CreateCategoryAsync(dto, userId);
                return Ok(new { message = "Category created successfully", categoryId = result });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to create category", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateCategory(int id, [FromBody] UpdateCategoryDto dto)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _categoryService.UpdateCategoryAsync(id, dto, userId);
                if (!result) return NotFound(new { message = "Category not found" });
                return Ok(new { message = "Category updated successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to update category", error = ex.Message });
            }
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            try
            {
                var userId = GetCurrentUserId();
                var result = await _categoryService.DeleteCategoryAsync(id, userId);
                if (!result) return NotFound(new { message = "Category not found" });
                return Ok(new { message = "Category deleted successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = "Failed to delete category", error = ex.Message });
            }
        }
    }
}
