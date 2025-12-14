using EWarehouse.Models;

namespace EWarehouse.Services
{
    public interface IProductLocationService
    {
        Task<IEnumerable<ProductLocation>> GetAllLocationsAsync();
        Task<ProductLocation?> GetLocationByIdAsync(int id);
        // Basic management methods if needed, though mostly handled via moves? 
        // Providing basic CRUD as requested "implement it all"
        Task<ProductLocation> CreateLocationAsync(ProductLocation location);
        Task<ProductLocation?> UpdateLocationAsync(ProductLocation location);
        Task<bool> DeleteLocationAsync(int id);
    }
}
