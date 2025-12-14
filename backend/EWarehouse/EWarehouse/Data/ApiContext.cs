using Microsoft.EntityFrameworkCore;
using EWarehouse.Models;

namespace EWarehouse.Data
{
    public class ApiContext : DbContext
    {
        public ApiContext(DbContextOptions<ApiContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<User> Users { get; set; }
        public DbSet<Warehouse> Warehouses { get; set; }
        public DbSet<Zone> Zones { get; set; }
        public DbSet<Bin> Bins { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductLocation> ProductLocations { get; set; }
        public DbSet<StockMovement> StockMovements { get; set; }
        public DbSet<StockStatus> StockStatuses { get; set; }
        public DbSet<Alert> Alerts { get; set; }
        public DbSet<AuditLog> AuditLogs { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure StockStatus composite key
            modelBuilder.Entity<StockStatus>()
                .HasKey(ss => new { ss.ProductID, ss.WarehouseID });

            // Configure User relationships
            modelBuilder.Entity<User>()
                .HasOne(u => u.Warehouse)
                .WithMany(w => w.Users)
                .HasForeignKey(u => u.WarehouseID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Warehouse relationships
            modelBuilder.Entity<Warehouse>()
                .HasOne(w => w.Manager)
                .WithMany()
                .HasForeignKey(w => w.ManagerID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Zone relationships
            modelBuilder.Entity<Zone>()
                .HasOne(z => z.Warehouse)
                .WithMany(w => w.Zones)
                .HasForeignKey(z => z.WarehouseID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure Bin relationships
            modelBuilder.Entity<Bin>()
                .HasOne(b => b.Warehouse)
                .WithMany(w => w.Bins)
                .HasForeignKey(b => b.WarehouseID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<Bin>()
                .HasOne(b => b.Zone)
                .WithMany(z => z.Bins)
                .HasForeignKey(b => b.ZoneID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Product relationships
            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryID)
                .OnDelete(DeleteBehavior.Cascade);

            // Configure ProductLocation relationships
            modelBuilder.Entity<ProductLocation>()
                .HasOne(pl => pl.Product)
                .WithMany(p => p.ProductLocations)
                .HasForeignKey(pl => pl.ProductID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ProductLocation>()
                .HasOne(pl => pl.Bin)
                .WithMany(b => b.ProductLocations)
                .HasForeignKey(pl => pl.BinID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure StockMovement relationships
            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.Product)
                .WithMany(p => p.StockMovements)
                .HasForeignKey(sm => sm.ProductID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.Warehouse)
                .WithMany(w => w.StockMovements)
                .HasForeignKey(sm => sm.WarehouseID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.User)
                .WithMany(u => u.StockMovements)
                .HasForeignKey(sm => sm.UserID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.FromBin)
                .WithMany(b => b.FromStockMovements)
                .HasForeignKey(sm => sm.FromBinID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StockMovement>()
                .HasOne(sm => sm.ToBin)
                .WithMany(b => b.ToStockMovements)
                .HasForeignKey(sm => sm.ToBinID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure StockStatus relationships
            modelBuilder.Entity<StockStatus>()
                .HasOne(ss => ss.Product)
                .WithMany(p => p.StockStatuses)
                .HasForeignKey(ss => ss.ProductID)
                .OnDelete(DeleteBehavior.NoAction);

            modelBuilder.Entity<StockStatus>()
                .HasOne(ss => ss.Warehouse)
                .WithMany(w => w.StockStatuses)
                .HasForeignKey(ss => ss.WarehouseID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure Alert relationships
            modelBuilder.Entity<Alert>()
                .HasOne(a => a.Product)
                .WithMany(p => p.Alerts)
                .HasForeignKey(a => a.ProductID)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Alert>()
                .HasOne(a => a.Warehouse)
                .WithMany(w => w.Alerts)
                .HasForeignKey(a => a.WarehouseID)
                .OnDelete(DeleteBehavior.NoAction);

            // Configure AuditLog relationships
            modelBuilder.Entity<AuditLog>()
                .HasOne(al => al.User)
                .WithMany(u => u.AuditLogs)
                .HasForeignKey(al => al.UserID)
                .OnDelete(DeleteBehavior.NoAction);
        }
    }
}
