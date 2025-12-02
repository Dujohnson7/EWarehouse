using E_Warehouse.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Data.SqlClient;

namespace E_Warehouse.Pages
{
    public class AddWarehouseModel : PageModel
    { 

        [BindProperty]
        public Warehouse warehouse { get; set; }
        public List<Users> Managers { get; set; } = new List<Users>();


        public void OnGet()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=localhost;Initial Catalog=EWarehouse_DB;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"))
                {
                    conn.Open();
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
            }
            catch (Exception ex)
            {
                Response.WriteAsync("Error: " + ex.Message);
            }
        }

        public IActionResult OnPost()
        {
            try
            {
                warehouse.Name = Request.Form["Name"]; 
                warehouse.Province = Request.Form["Province"];
                warehouse.District = Request.Form["District"];
                warehouse.Address = Request.Form["Address"];

                string managerValue = Request.Form["ManagerID"];

                if (string.IsNullOrWhiteSpace(managerValue))
                    warehouse.ManagerID = null;              
                else
                    warehouse.ManagerID = int.Parse(managerValue);

                warehouse.IsActive = true;
                warehouse.CreatedAt = DateTime.Now;

                using (SqlConnection conn = new SqlConnection("Data Source=localhost;Initial Catalog=EWarehouse_DB;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"))
                {
                    conn.Open();
                    string sql = @"INSERT INTO Warehouses 
                                   (Name, Province, District, Address, ManagerID, IsActive, CreatedAt) 
                                   VALUES 
                                   (@Name, @Province, @District, @Address, @ManagerID, @IsActive, @CreatedAt)";

                    using (SqlCommand cmd = new SqlCommand(sql, conn))
                    {
                        cmd.Parameters.AddWithValue("@Name", warehouse.Name); 
                        cmd.Parameters.AddWithValue("@Province", warehouse.Province);
                        cmd.Parameters.AddWithValue("@District", warehouse.District);
                        cmd.Parameters.AddWithValue("@Address", warehouse.Address);

                        if (warehouse.ManagerID.HasValue)
                            cmd.Parameters.AddWithValue("@ManagerID", warehouse.ManagerID.Value);
                        else
                            cmd.Parameters.AddWithValue("@ManagerID", DBNull.Value);

                        cmd.Parameters.AddWithValue("@IsActive", warehouse.IsActive);
                        cmd.Parameters.AddWithValue("@CreatedAt", warehouse.CreatedAt);

                        int result = cmd.ExecuteNonQuery();
                        if(result > 0)
                        { 
                             return Content("<script>alert('Warehouse added successfully!');window.location='/Warehouse';</script>", "text/html");
                          
                        }
                        else
                        {
                            return Content("<script>alert('Warehouse added fail!');</script>", "text/html");
                        }
                    }
                }
                 
            }
            catch (Exception ex)
            {
                return Content($"<script>alert('Error: {ex.Message}');</script>", "text/html"); 
            }
            return Page();
        }
    }
}
