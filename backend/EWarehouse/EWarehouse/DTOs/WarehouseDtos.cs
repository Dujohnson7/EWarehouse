namespace EWarehouse.DTOs
{
    public class CreateWarehouseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = "RWANDA";
        public string? Province { get; set; }
        public string? District { get; set; }
        public string? Address { get; set; }
        public int? ManagerID { get; set; }
    }

    public class UpdateWarehouseDto
    {
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = "RWANDA";
        public string? Province { get; set; }
        public string? District { get; set; }
        public string? Address { get; set; }
        public int? ManagerID { get; set; }
        public bool IsActive { get; set; }
    }

    public class WarehouseDto
    {
        public int WarehouseID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Country { get; set; } = string.Empty;
        public string? Province { get; set; }
        public string? District { get; set; }
        public string? Address { get; set; }
        public int? ManagerID { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
