using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using MiniCoreBancario.Data;
using MiniCoreBancario.DTOs;
using MiniCoreBancario.Models;

namespace MiniCoreBancario.Services
{
    public class CuentasService : ICuentasService
    {
        private readonly AppDbContext _context;

        public CuentasService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<CuentaDto>> GetCuentasAsync()
        {
            return await _context.Cuentas
                .Select(c => new CuentaDto
                {
                    Id = c.Id,
                    NumeroCuenta = c.NumeroCuenta,
                    Titular = c.Titular,
                    Saldo = c.Saldo
                })
                .ToListAsync();
        }

        public async Task<CuentaDto> CrearCuentaAsync(CrearCuentaDto dto)
        {
            var cuenta = new Cuenta
            {
                NumeroCuenta = dto.NumeroCuenta,
                Titular = dto.Titular,
                Saldo = 0
            };

            _context.Cuentas.Add(cuenta);
            await _context.SaveChangesAsync();

            return new CuentaDto
            {
                Id = cuenta.Id,
                NumeroCuenta = cuenta.NumeroCuenta,
                Titular = cuenta.Titular,
                Saldo = cuenta.Saldo
            };
        }

        public async Task<TransaccionDto> DepositoAsync(int cuentaId, decimal monto)
        {
            if (monto <= 0) throw new ArgumentException("El monto debe ser mayor a cero.");

            var cuenta = await _context.Cuentas.FindAsync(cuentaId);
            if (cuenta == null) throw new KeyNotFoundException("Cuenta no encontrada.");

            cuenta.Saldo += monto;
            
            var transaccion = new Transaccion
            {
                CuentaId = cuentaId,
                Monto = monto,
                Tipo = "Depósito",
                Fecha = DateTime.UtcNow
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return new TransaccionDto
            {
                Id = transaccion.Id,
                CuentaId = transaccion.CuentaId,
                Monto = transaccion.Monto,
                Tipo = transaccion.Tipo,
                Fecha = transaccion.Fecha
            };
        }

        public async Task<TransaccionDto> RetiroAsync(int cuentaId, decimal monto)
        {
            if (monto <= 0) throw new ArgumentException("El monto debe ser mayor a cero.");

            var cuenta = await _context.Cuentas.FindAsync(cuentaId);
            if (cuenta == null) throw new KeyNotFoundException("Cuenta no encontrada.");

            if (cuenta.Saldo < monto) throw new InvalidOperationException("Saldo insuficiente.");

            cuenta.Saldo -= monto;

            var transaccion = new Transaccion
            {
                CuentaId = cuentaId,
                Monto = monto,
                Tipo = "Retiro",
                Fecha = DateTime.UtcNow
            };

            _context.Transacciones.Add(transaccion);
            await _context.SaveChangesAsync();

            return new TransaccionDto
            {
                Id = transaccion.Id,
                CuentaId = transaccion.CuentaId,
                Monto = transaccion.Monto,
                Tipo = transaccion.Tipo,
                Fecha = transaccion.Fecha
            };
        }
    }
}
