using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace EWarehouse.Models
{
    [Table("Users")]
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [MaxLength(150)]
        public string? UserProfile { get; set; }

        [Required]
        [MaxLength(150)]
        public string FullName { get; set; } = string.Empty;

        [Required]
        [MaxLength(150)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Password { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string Role { get; set; } = string.Empty; // Admin, General_Manager, Manager, Clerk

        public int? WarehouseID { get; set; }

        [ForeignKey("WarehouseID")]
        public Warehouse? Warehouse { get; set; }

        public bool isUpdate { get; set; } = false;

        public bool isInsert { get; set; } = true;

        public bool isDelete { get; set; } = false;

        public bool IsActive { get; set; } = true;

        public DateTime CreatedAt { get; set; } = DateTime.Now;

        // Navigation properties
        public ICollection<StockMovement>? StockMovements { get; set; }
        public ICollection<AuditLog>? AuditLogs { get; set; }
    }
}
