namespace MiniCoreBancario.Models
{
    public class Cuenta
    {
        public int Id { get; set; }
        public required string NumeroCuenta { get; set; }
        public required string Titular { get; set; }
        public decimal Saldo { get; set; }
    }
}
