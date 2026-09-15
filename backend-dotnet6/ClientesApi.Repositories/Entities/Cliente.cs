namespace ClientesApi.Repositories.Entities;

public sealed class Cliente
{
    public int Id { get; set; }

    public string Identificacion { get; set; } = string.Empty;

    public string Nombres { get; set; } = string.Empty;

    public string Apellidos { get; set; } = string.Empty;

    public string Correo { get; set; } = string.Empty;

    public string? Telefono { get; set; }
}
