namespace MiniCoreBancario.DTOs
{
    public class CuentaDto
    {
        public int Id { get; set; }
        public required string NumeroCuenta { get; set; }
        public required string Titular { get; set; }
        public decimal Saldo { get; set; }
    }
}
