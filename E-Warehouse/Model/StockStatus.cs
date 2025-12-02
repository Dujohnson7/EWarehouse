namespace E_Warehouse.Model
{
    public class StockStatus
    {
        public int WarehouseID { get; set; }

        public int ProductID { get; set; }
        public int Quantity { get; set; }
        public string StockLevel { get; set; }
        public DateTime UpdatedAt { get; set; }

    }
}
