using EWarehouse.Data;
using EWarehouse.Models;
using Microsoft.EntityFrameworkCore;

namespace EWarehouse.Services
{
    public class AuditLogService : IAuditLogService
    {
        private readonly ApiContext _context;

        public AuditLogService(ApiContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<AuditLog>> GetAllAuditLogsAsync()
        {
            return await _context.AuditLogs
                .Include(a => a.User)
                .OrderByDescending(a => a.CreatedAt)
                .ToListAsync();
        }

        public async Task<AuditLog?> GetAuditLogByIdAsync(int id)
        {
            return await _context.AuditLogs
                .Include(a => a.User)
                .FirstOrDefaultAsync(a => a.AuditID == id);
        }
    }
}
