using ClientesApi.Models;

namespace ClientesApi.Repositories;

public interface IClienteRepository
{
    Task<ClienteDto?> ObtenerPorIdentificacionAsync(
        string identificacion,
        CancellationToken cancellationToken = default);
}
