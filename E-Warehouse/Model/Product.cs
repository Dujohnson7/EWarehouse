namespace E_Warehouse.Model
{
    public class Product
    {
        public int ProductID { get; set; }
        public string ProductName { get; set; }
        public string Description { get; set; }
        public string SKU { get; set; }
        public int CategoryID { get; set; }
        public string Image { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }


    }
}
