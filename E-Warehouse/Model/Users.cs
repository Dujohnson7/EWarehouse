namespace E_Warehouse.Model
{
    public class Users
    {
        public int UserID { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string Password { get; set; }
        public string Role { get; set; }
        public int WarehouseID { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreatedAt { get; set; }


    }
}
