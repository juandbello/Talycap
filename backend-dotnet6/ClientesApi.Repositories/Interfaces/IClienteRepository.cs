using ClientesApi.DTOs;
namespace ClientesApi.Repositories.Interfaces;
public interface IClienteRepository { Task<ClienteDto?> ObtenerPorIdentificacionAsync(string identificacion, CancellationToken cancellationToken = default); }
