using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("ProductLocations")]
    public class ProductLocation
    {
        [Key]
        public int ProductLocationID { get; set; }

        public int ProductID { get; set; }

        [ForeignKey("ProductID")]
        public Product? Product { get; set; }

        public string BinID { get; set; }

        [ForeignKey("BinID")]
        public Bin? Bin { get; set; }

        public int Quantity { get; set; }

        public DateTime AssignedAt { get; set; } = DateTime.Now;
    }
}
