using ClientesApi.Models;

namespace ClientesApi.Services;

public interface IClienteService
{
    Task<ClienteDto?> ObtenerPorIdentificacionAsync(
        string identificacion,
        CancellationToken cancellationToken = default);
}
