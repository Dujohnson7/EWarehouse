using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("Alerts")]
    public class Alert
    {
        [Key]
        public int AlertID { get; set; }

        public int ProductID { get; set; }
        
        [ForeignKey("ProductID")]
        public Product? Product { get; set; }

        public int? WarehouseID { get; set; }
        
        [ForeignKey("WarehouseID")]
        public Warehouse? Warehouse { get; set; }

        [Required]
        [MaxLength(50)]
        public string AlertType { get; set; } = string.Empty; // OutStock, LowStock, No_Location, FullStock

        [Required]
        [MaxLength(255)]
        public string Message { get; set; } = string.Empty;

        public bool IsAcknowledged { get; set; } = false;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
