namespace E_Warehouse.Model
{
    public class Alert
    {
        public int AlertID { get; set; }
        public int WarehouseID { get; set; }
        public int ProductID { get; set; }
        public string AlertType { get; set; }
        public string Message { get; set; }
        public bool IsAcknowledged { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
