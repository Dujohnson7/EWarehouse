namespace E_Warehouse.Model
{
    public class Bins
    {
        public int BinID { get; set; }
        public int WarehouseID { get; set; }
        public int ZoneID { get; set; }
        public string BinCode { get; set; }
        public int Capacity { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }

    }
}
