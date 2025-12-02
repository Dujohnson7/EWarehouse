namespace E_Warehouse.Model
{
    public class ProductLocation
    {
        public int ProductLocationID { get; set; }
        public int ProductID { get; set; }
        public int BinID { get; set; }
        public int Quantity { get; set; }
        public DateTime AssignedAt { get; set; }
    }
}
