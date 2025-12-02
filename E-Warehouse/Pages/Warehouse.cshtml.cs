using E_Warehouse.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using System.Data.SqlClient;

namespace E_Warehouse.Pages
{
    public class WarehouseModel : PageModel
    { 
        public List<Warehouse> warehouseLists = new List<Warehouse>();

        public void OnGet()
        {
            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=localhost;Initial Catalog=EWarehouse_DB;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"))
                {
                    conn.Open();
                    string query = @"SELECT * FROM Warehouses";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        using (SqlDataReader reader = cmd.ExecuteReader())
                        {
                            while (reader.Read())
                            {
                                Warehouse warehouse = new Warehouse();
                                warehouse.WarehouseID = reader.GetInt32(reader.GetOrdinal("WarehouseID"));
                                warehouse.Name = reader["Name"].ToString();
                                warehouse.Country = reader["Country"].ToString();
                                warehouse.Province = reader["Province"].ToString();
                                warehouse.District = reader["District"].ToString();
                                warehouse.Address = reader["Address"].ToString();
                                warehouse.IsActive = reader.GetBoolean(reader.GetOrdinal("IsActive"));
                                warehouse.CreatedAt = reader.GetDateTime(reader.GetOrdinal("CreatedAt"));
                                warehouseLists.Add(warehouse);
                            }
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Response.WriteAsync("Error: " + ex.Message);
            }
        }

        public IActionResult OnPostDelete(int id)
        {
            try
            {
                using (SqlConnection conn = new SqlConnection("Data Source=localhost;Initial Catalog=EWarehouse_DB;Integrated Security=True;Encrypt=True;TrustServerCertificate=True"))
                {
                    conn.Open();
                    string query = "DELETE FROM Warehouses WHERE WarehouseID = @WarehouseID";

                    using (SqlCommand cmd = new SqlCommand(query, conn))
                    {
                        cmd.Parameters.AddWithValue("@WarehouseID", id);
                        int result = cmd.ExecuteNonQuery();

                        if (result > 0)
                        {
                            return Content("<script>alert('Warehouse delete successfully!');window.location='/Warehouse';</script>", "text/html");
                        }
                        else
                        {
                            return Content("<script>alert('Warehouse delete fail!');window.location='/Warehouse';</script>", "text/html");
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                return Content($"<script>alert('Delete Error: {ex.Message}');</script>", "text/html");
            }

            return RedirectToPage();
        }


    }
}
