namespace EWarehouse.DTOs
{
    public class CreateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
    }

    public class UpdateCategoryDto
    {
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
    }

    public class CategoryDto
    {
        public int CategoryID { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateZoneDto
    {
        public int WarehouseID { get; set; }
        public string ZoneName { get; set; } = string.Empty;
    }

    public class UpdateZoneDto
    {
        public int WarehouseID { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
    }

    public class ZoneDto
    {
        public int ZoneID { get; set; }
        public int WarehouseID { get; set; }
        public string ZoneName { get; set; } = string.Empty;
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateBinDto
    {
        public string BinCode { get; set; } = string.Empty;
        public int WarehouseID { get; set; }
        public int ZoneID { get; set; }
        public int Capacity { get; set; }
    }

    public class UpdateBinDto
    {
        public int WarehouseID { get; set; }
        public int ZoneID { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
    }

    public class BinDto
    {
        public string BinCode { get; set; } = string.Empty;
        public int WarehouseID { get; set; }
        public int ZoneID { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateAlertDto
    {
        public int ProductID { get; set; }
        public int? WarehouseID { get; set; }
        public string AlertType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsAcknowledged { get; set; }
    }

    public class UpdateAlertDto
    {
        public int ProductID { get; set; }
        public int? WarehouseID { get; set; }
        public string AlertType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsAcknowledged { get; set; }
    }

    public class AlertDto
    {
        public int AlertID { get; set; }
        public int ProductID { get; set; }
        public int? WarehouseID { get; set; }
        public string AlertType { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsAcknowledged { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
