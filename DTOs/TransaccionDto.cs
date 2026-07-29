using System;

namespace MiniCoreBancario.DTOs
{
    public class TransaccionDto
    {
        public int Id { get; set; }
        public int CuentaId { get; set; }
        public decimal Monto { get; set; }
        public required string Tipo { get; set; }
        public DateTime Fecha { get; set; }
    }
}
