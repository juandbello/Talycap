using ClientesApi.Models;
using ClientesApi.Repositories;

namespace ClientesApi.Services;

public sealed class ClienteService : IClienteService
{
    private readonly IClienteRepository _clienteRepository;

    public ClienteService(IClienteRepository clienteRepository)
    {
        _clienteRepository = clienteRepository;
    }

    public Task<ClienteDto?> ObtenerPorIdentificacionAsync(
        string identificacion,
        CancellationToken cancellationToken = default)
    {
        if (string.IsNullOrWhiteSpace(identificacion))
        {
            throw new ArgumentException(
                "La identificación es obligatoria.",
                nameof(identificacion));
        }

        return _clienteRepository.ObtenerPorIdentificacionAsync(
            identificacion.Trim(),
            cancellationToken);
    }
}
