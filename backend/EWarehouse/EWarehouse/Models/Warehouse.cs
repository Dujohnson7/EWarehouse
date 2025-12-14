using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("Warehouses")]
    public class Warehouse
    {
        [Key]
        public int WarehouseID { get; set; }

        [Required]
        [MaxLength(120)]
        public string Name { get; set; } = string.Empty;

        [MaxLength(255)]
        public string Country { get; set; } = "RWANDA";

        [MaxLength(255)]
        public string? Province { get; set; }

        [MaxLength(255)]
        public string? District { get; set; }

        [MaxLength(255)]
        public string? Address { get; set; }

        public int? ManagerID { get; set; }

        [ForeignKey("ManagerID")]
        public User? Manager { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public ICollection<User>? Users { get; set; }
        public ICollection<Zone>? Zones { get; set; }
        public ICollection<Bin>? Bins { get; set; }
        public ICollection<StockMovement>? StockMovements { get; set; }
        public ICollection<StockStatus>? StockStatuses { get; set; }
        public ICollection<Alert>? Alerts { get; set; }
    }
}
