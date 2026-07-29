using Microsoft.EntityFrameworkCore;
using MiniCoreBancario.Models;

namespace MiniCoreBancario.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Cuenta> Cuentas { get; set; }
        public DbSet<Transaccion> Transacciones { get; set; }
    }
}
