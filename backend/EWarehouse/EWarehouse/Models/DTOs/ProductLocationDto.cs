using System.ComponentModel.DataAnnotations;

namespace EWarehouse.Models.DTOs
{
    public class ProductLocationDto
    {
        public int ProductLocationID { get; set; }

        [Required]
        public int ProductID { get; set; }

        [Required]
        public string BinID { get; set; } = string.Empty;

        [Required]
        [Range(1, int.MaxValue)]
        public int Quantity { get; set; }



        public Product? Product { get; set; }
        
        public Bin? bin { get; set; }

        public DateTime AssignedAt { get; set; }
    }
}
