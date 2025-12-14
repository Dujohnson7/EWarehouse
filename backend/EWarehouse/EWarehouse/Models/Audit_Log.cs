using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("AuditLog")]
    public class AuditLog
    {
        [Key]
        public int AuditID { get; set; }

        public int UserID { get; set; }

        [ForeignKey("UserID")]
        public User? User { get; set; }

        [Required]
        [MaxLength(200)]
        public string Action { get; set; } = string.Empty; // INSERT, UPDATE, DELETE, ASSIGN, LOGIN, TRANSFER, ADJUST, IN, OUT

        public DateTime CreatedAt { get; set; } = DateTime.Now;
    }
}
