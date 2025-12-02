namespace E_Warehouse.Model
{
    public class StockMovement
    {
        public int StockMovementID { get; set; }
        public int WarehouseID { get; set; }
        public int ProductID { get; set; }
        public int UserID { get; set; }
        public string MovementType { get; set; }
        public int FromBinID { get; set; }
        public int ToBinID { get; set; }
        public int Quantity { get; set; }
        public string Reason { get; set; }
        public DateTime MovementDate { get; set; }
    }
}
