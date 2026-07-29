using System;

namespace MiniCoreBancario.Models
{
    public class Transaccion
    {
        public int Id { get; set; }
        public int CuentaId { get; set; }
        public decimal Monto { get; set; }
        public required string Tipo { get; set; } // "Depósito" o "Retiro"
        public DateTime Fecha { get; set; } = DateTime.UtcNow;

        public Cuenta? Cuenta { get; set; }
    }
}
