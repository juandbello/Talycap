using Microsoft.EntityFrameworkCore;
namespace ClientesApi.Repositories.Data;
public sealed class ClientesDbContext : DbContext
{
    public ClientesDbContext(DbContextOptions<ClientesDbContext> options) : base(options) { }
    public DbSet<Cliente> Clientes => Set<Cliente>();
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity => { entity.ToTable("Clientes"); entity.HasKey(x => x.Id); entity.Property(x => x.Identificacion).HasMaxLength(30); entity.Property(x => x.Nombres).HasMaxLength(100); entity.Property(x => x.Apellidos).HasMaxLength(100); });
    }
}
public sealed class Cliente { public int Id { get; set; } public string Identificacion { get; set; } = string.Empty; public string Nombres { get; set; } = string.Empty; public string Apellidos { get; set; } = string.Empty; public string Correo { get; set; } = string.Empty; public string? Telefono { get; set; } }
