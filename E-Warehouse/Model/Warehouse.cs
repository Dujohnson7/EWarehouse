namespace E_Warehouse.Model
{
    public class Warehouse
    {
        public int WarehouseID { get; set; }
        public string Name { get; set; }
        public string Country { get; set; }
        public string Province { get; set; }
        public string District { get; set; }
        public string Address { get; set; }
        public int? ManagerID { get; set; }
        public Users Manager { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
