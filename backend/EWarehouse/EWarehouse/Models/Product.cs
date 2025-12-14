using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("Product")]
    public class Product
    {
        [Key]
        public int ProductID { get; set; }

        [Required]
        [MaxLength(200)]
        public string ProductName { get; set; } = string.Empty;

        [Required]
        [MaxLength(100)]
        public string SKU { get; set; } = string.Empty;

        public int CategoryID { get; set; }

        [ForeignKey("CategoryID")]
        public Category? Category { get; set; }

        [Column(TypeName = "float")]
        public double? Price { get; set; }

        [Column(TypeName = "text")]
        public string? Description { get; set; }

        [MaxLength(255)]
        public string? Image { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public ICollection<ProductLocation>? ProductLocations { get; set; }
        public ICollection<StockMovement>? StockMovements { get; set; }
        public ICollection<StockStatus>? StockStatuses { get; set; }
        public ICollection<Alert>? Alerts { get; set; }
    }
}
