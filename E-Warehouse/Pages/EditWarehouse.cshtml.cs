using E_Warehouse.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Data.SqlClient;

namespace E_Warehouse.Pages
{
    public class EditWarehouseModel : PageModel
    {
        [BindProperty]
        public Warehouse warehouse { get; set; }

        public List<Users> Managers { get; set; } = new List<Users>();

        public IActionResult OnGet(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=localhost;Initial Catalog=EWarehouse_DB;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"))
                {
                    conn.Open();
                    string query = "SELECT * FROM Warehouses WHERE WarehouseID = @WarehouseID";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@WarehouseID", id);
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            if (reader.Read())
                            {
                                warehouse = new Warehouse
                                {
                                    WarehouseID = reader.GetInt32(reader.GetOrdinal("WarehouseID")),
                                    Name = reader["Name"].ToString(), 
                                    Province = reader["Province"].ToString(),
                                    District = reader["District"].ToString(),
                                    Address = reader["Address"].ToString(),
                                    IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive"))
                                };
                            }
                            else
                            {
                                return RedirectToPage("/Warehouse");
                            }
                        }
                    }


                    string managerQuery = "SELECT UserID, FullName FROM [User] WHERE Role = 'MANAGER' AND IsActive = 1";

                    using (SqlCommand cmd = new SqlCommand(managerQuery, conn))
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            Managers.Add(new Users
                            {
                                UserID = reader.GetInt32(reader.GetOrdinal("UserID")),
                                FullName = reader["FullName"].ToString()
                            });
                        }
                    }

                }

                return Page();
            }
            catch (Exception ex)
            {
                TempData["Message"] = "Error: " + ex.Message;
                return RedirectToPage("/Warehouse");
            }
        }

        public IActionResult OnPost()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=localhost;Initial Catalog=EWarehouse_DB;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"))
                {
                    conn.Open();
                    string query = @"UPDATE Warehouses SET
                                        Name = @Name,
                                        Province = @Province,
                                        District = @District,
                                        Address = @Address,
                                        ManagerID = @ManagerID, 
                                        IsActive = @IsActive
                                     WHERE WarehouseID = @WarehouseID";
                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@WarehouseID", warehouse.WarehouseID);
                        cmd.Parameters.AddWithValue("@Name", warehouse.Name);
                        cmd.Parameters.AddWithValue("@Province", warehouse.Province);
                        cmd.Parameters.AddWithValue("@District", warehouse.District);
                        cmd.Parameters.AddWithValue("@Address", warehouse.Address);
                        cmd.Parameters.AddWithValue("@ManagerID", warehouse.ManagerID.HasValue ? (object)warehouse.ManagerID.Value : DBNull.Value);
                        cmd.Parameters.AddWithValue("@IsActive", warehouse.IsActive);
                        int result = cmd.ExecuteNonQuery();
                        if (result > 0)
                        {
                            return Content("<script>alert('Warehouse update successfully!');window.location='/Warehouse';</script>", "text/html");
                        }
                        else
                        { 
                            return Content("<script>alert('Warehouse update successfully!');window.location='/Warehouse';</script>", "text/html");
                        }
                    }
                }
                return RedirectToPage("/Warehouse");
            }
            catch (Exception ex)
            {
                TempData["Message"] = "Error: " + ex.Message;
                return RedirectToPage("/Warehouse");
            }
        }
    }
}