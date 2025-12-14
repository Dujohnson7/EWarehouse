namespace EWarehouse.DTOs
{
    public class StockInDto
    {
        public int ProductID { get; set; }
        public int WarehouseID { get; set; }
        public string? ToBinID { get; set; }
        public int Quantity { get; set; }
    }

    public class StockOutDto
    {
        public int ProductID { get; set; }
        public int WarehouseID { get; set; }
        public string? FromBinID { get; set; }
        public int Quantity { get; set; }
        public string? Reason { get; set; }
    }

    public class StockAdjustDto
    {
        public int ProductID { get; set; }
        public int WarehouseID { get; set; }
        public string? FromBinID { get; set; }
        public int Quantity { get; set; }
        public string? Reason { get; set; }
    }

    public class TransferOutDto
    {
        public int ProductID { get; set; }
        public int WarehouseID_OUT { get; set; }
        public int WarehouseID_IN { get; set; }
        public string FromBinID { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Reason { get; set; }
        public int TransferCode { get; set; }
    }

    public class TransferInDto
    {
        public int ProductID { get; set; }
        public int WarehouseID_IN { get; set; }
        public int UserID { get; set; }
        public string FromBinID { get; set; } = string.Empty;
        public string ToBinID { get; set; } = string.Empty;
        public int Quantity { get; set; }
        public string? Reason { get; set; }
        public int TransferCode { get; set; }
    }

    public class UpdateStockInDto
    {
        public int NewQuantity { get; set; }
        public string? ToBinID { get; set; }
    }

    public class UpdateStockOutDto
    {
        public int NewQuantity { get; set; }
        public string? FromBinID { get; set; }
        public string? Reason { get; set; }
    }

    public class UpdateStockAdjustDto
    {
        public int NewQuantity { get; set; }
        public string? Reason { get; set; }
    }

    public class UpdateTransferOutDto
    {
        public int NewQuantity { get; set; }
        public string FromBinID { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class UpdateTransferInDto
    {
        public int NewQuantity { get; set; }
        public string ToBinID { get; set; } = string.Empty;
        public string? Reason { get; set; }
    }

    public class StockMovementDto
    {
        public int MovementID { get; set; }
        public int ProductID { get; set; }
        public int WarehouseID { get; set; }
        public int? UserID { get; set; }
        public string MovementType { get; set; } = string.Empty;
        public string? FromBinID { get; set; }
        public string? ToBinID { get; set; }
        public int Quantity { get; set; }
        public string? Reason { get; set; }
        public DateTime CreatedAt { get; set; }
        public int? TransferCode { get; set; }
        public bool? TransferStatus { get; set; }
        
        // Navigation properties for frontend
        public ProductDto? Product { get; set; }
        public UserDto? User { get; set; }
        public WarehouseDto? Warehouse { get; set; }
    }
}
