using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("Bins")]
    public class Bin
    {
        [Key]
        [MaxLength(50)]
        public string BinCode { get; set; } = string.Empty;

        public int WarehouseID { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse? Warehouse { get; set; }

        public int ZoneID { get; set; }

        [ForeignKey("ZoneID")]
        public Zone? Zone { get; set; }

        public int Capacity { get; set; }

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public ICollection<ProductLocation>? ProductLocations { get; set; }
        public ICollection<StockMovement>? FromStockMovements { get; set; }
        public ICollection<StockMovement>? ToStockMovements { get; set; }
    }
}
