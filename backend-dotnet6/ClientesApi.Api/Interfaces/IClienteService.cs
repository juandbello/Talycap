using ClientesApi.DTOs;

namespace ClientesApi.Services.Interfaces;

public interface IClienteService
{
    Task<ClienteDto?> ObtenerPorIdentificacionAsync(
        string identificacion,
        CancellationToken cancellationToken = default);
}
