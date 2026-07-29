using System.Collections.Generic;
using System.Threading.Tasks;
using MiniCoreBancario.DTOs;

namespace MiniCoreBancario.Services
{
    public interface ICuentasService
    {
        Task<IEnumerable<CuentaDto>> GetCuentasAsync();
        Task<CuentaDto> CrearCuentaAsync(CrearCuentaDto dto);
        Task<TransaccionDto> DepositoAsync(int cuentaId, decimal monto);
        Task<TransaccionDto> RetiroAsync(int cuentaId, decimal monto);
    }
}
