using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("StockMovements")]
    public class StockMovement
    {
        [Key]
        public int MovementID { get; set; }

        public int ProductID { get; set; }

        [ForeignKey("ProductID")]
        public Product? Product { get; set; }

        public int WarehouseID { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse? Warehouse { get; set; }

        public int? UserID { get; set; }

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [Required]
        [MaxLength(20)]
        public string MovementType { get; set; } = string.Empty; // IN, OUT, ADJUST, Transfer_In, Transfer_Out

        public string? FromBinID { get; set; }

        [ForeignKey("FromBinID")]
        public Bin? FromBin { get; set; }

        public string? ToBinID { get; set; }

        [ForeignKey("ToBinID")]
        public Bin? ToBin { get; set; }

        public int Quantity { get; set; }

        [MaxLength(255)]
        public string? Reason { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        public int? TransferCode { get; set; }

        public bool? TransferStatus { get; set; } = false;

        [NotMapped]
        public DateTime? UpdateAt { get; set; }
    }
}
