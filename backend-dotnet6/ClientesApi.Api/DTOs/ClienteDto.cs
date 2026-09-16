namespace ClientesApi.DTOs;

public sealed class ClienteDto
{
    public string Identificacion { get; init; } = string.Empty;

    public string Nombres { get; init; } = string.Empty;

    public string Apellidos { get; init; } = string.Empty;

    public string Correo { get; init; } = string.Empty;

    public string Telefono { get; init; } = string.Empty;
}
