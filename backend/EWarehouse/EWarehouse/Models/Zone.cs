using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("Zones")]
    public class Zone
    {
        [Key]
        public int ZoneID { get; set; }

        public int WarehouseID { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse? Warehouse { get; set; }

        [Required]
        [MaxLength(100)]
        public string ZoneName { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;
         
        public ICollection<Bin>? Bins { get; set; }
    }
}
