using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using MiniCoreBancario.Data;
using MiniCoreBancario.Models;

namespace MiniCoreBancario.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentasController : ControllerBase
    {
        private readonly AppDbContext _context;

        public CuentasController(AppDbContext context)
        {
            _context = context;
        }

        // GET: api/cuentas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cuenta>>> GetCuentas()
        {
            return await _context.Cuentas.ToListAsync();
        }

        // POST: api/cuentas
        [HttpPost]
        public async Task<ActionResult<Cuenta>> CrearCuenta(Cuenta cuenta)
        {
            _context.Cuentas.Add(cuenta);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetCuentas), new { id = cuenta.Id }, cuenta);
        }

        // POST: api/cuentas/{id}/deposito
        [HttpPost("{id}/deposito")]
        public async Task<IActionResult> Deposito(int id, [FromBody] decimal monto)
        {
            if (monto <= 0) return BadRequest("El monto debe ser mayor a cero.");

            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null) return NotFound("Cuenta no encontrada.");

            cuenta.Saldo += monto;
            
            var transaccion = new Transaccion
            {
                CuentaId = id,
                Monto = monto,
                Tipo = "Depósito",
                Fecha = DateTime.UtcNow
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return Ok(new { Mensaje = "Depósito exitoso", SaldoActual = cuenta.Saldo });
        }

        // POST: api/cuentas/{id}/retiro
        [HttpPost("{id}/retiro")]
        public async Task<IActionResult> Retiro(int id, [FromBody] decimal monto)
        {
            if (monto <= 0) return BadRequest("El monto debe ser mayor a cero.");

            var cuenta = await _context.Cuentas.FindAsync(id);
            if (cuenta == null) return NotFound("Cuenta no encontrada.");

            if (cuenta.Saldo < monto) return BadRequest("Saldo insuficiente.");

            cuenta.Saldo -= monto;

            var transaccion = new Transaccion
            {
                CuentaId = id,
                Monto = monto,
                Tipo = "Retiro",
                Fecha = DateTime.UtcNow
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return Ok(new { Mensaje = "Retiro exitoso", SaldoActual = cuenta.Saldo });
        }
    }
}
