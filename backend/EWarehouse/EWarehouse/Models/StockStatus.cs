using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("StockStatus")]
    public class StockStatus
    {
        [Key]
        [Column(Order = 0)]
        public int ProductID { get; set; }

        [Key]
        [Column(Order = 1)]
        public int WarehouseID { get; set; }

        [ForeignKey("ProductID")]
        public Product? Product { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse? Warehouse { get; set; }

        [Column(TypeName = "float")]
        public double Quantity { get; set; }

        [MaxLength(255)]
        public string? StockLevel { get; set; } // OutStock, LowStock, Normal

        public DateTime UpdateAt { get; set; } = DateTime.Now;
    }
}
