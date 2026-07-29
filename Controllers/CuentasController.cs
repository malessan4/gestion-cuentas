using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MiniCoreBancario.DTOs;
using MiniCoreBancario.Services;

namespace MiniCoreBancario.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CuentasController : ControllerBase
    {
        private readonly ICuentasService _cuentasService;

        public CuentasController(ICuentasService cuentasService)
        {
            _cuentasService = cuentasService;
        }

        // GET: api/cuentas
        [HttpGet]
        public async Task<ActionResult<IEnumerable<CuentaDto>>> GetCuentas()
        {
            var cuentas = await _cuentasService.GetCuentasAsync();
            return Ok(cuentas);
        }

        // POST: api/cuentas
        [HttpPost]
        public async Task<ActionResult<CuentaDto>> CrearCuenta([FromBody] CrearCuentaDto dto)
        {
            var cuenta = await _cuentasService.CrearCuentaAsync(dto);
            return CreatedAtAction(nameof(GetCuentas), new { id = cuenta.Id }, cuenta);
        }

        // POST: api/cuentas/{id}/deposito
        [HttpPost("{id}/deposito")]
        public async Task<IActionResult> Deposito(int id, [FromBody] decimal monto)
        {
            try
            {
                var transaccion = await _cuentasService.DepositoAsync(id, monto);
                return Ok(new { Mensaje = "Depósito exitoso", Transaccion = transaccion });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
        }

        // POST: api/cuentas/{id}/retiro
        [HttpPost("{id}/retiro")]
        public async Task<IActionResult> Retiro(int id, [FromBody] decimal monto)
        {
            try
            {
                var transaccion = await _cuentasService.RetiroAsync(id, monto);
                return Ok(new { Mensaje = "Retiro exitoso", Transaccion = transaccion });
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (InvalidOperationException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
