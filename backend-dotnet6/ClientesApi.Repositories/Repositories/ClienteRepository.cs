using ClientesApi.DTOs;
using ClientesApi.Repositories.Interfaces;
using ClientesApi.Repositories.Data;
using Microsoft.EntityFrameworkCore;

namespace ClientesApi.Repositories.Repositories;

public sealed class ClienteRepository : IClienteRepository
{
    private readonly ClientesDbContext _context;

    public ClienteRepository(ClientesDbContext context)
    {
        _context = context;
    }

    public async Task<ClienteDto?> ObtenerPorIdentificacionAsync(
        string identificacion,
        CancellationToken cancellationToken = default)
    {
        // El EXEC no admite operadores SQL adicionales; seleccionamos en memoria.
        var clientes = await _context.Clientes
            .FromSqlInterpolated(
                $"EXEC dbo.sp_ObtenerCliente @Identificacion={identificacion}")
            .AsNoTracking()
            .ToListAsync(cancellationToken);

        var cliente = clientes.FirstOrDefault();

        return cliente is null
            ? null
            : new ClienteDto
            {
                Identificacion = cliente.Identificacion,
                Nombres = cliente.Nombres,
                Apellidos = cliente.Apellidos,
                Correo = cliente.Correo,
                Telefono = cliente.Telefono ?? string.Empty
            };
    }
}
