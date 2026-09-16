using Microsoft.EntityFrameworkCore;
using ClientesApi.Models;

namespace ClientesApi.Data;

public sealed class ClientesDbContext : DbContext
{
    public ClientesDbContext(DbContextOptions<ClientesDbContext> options)
        : base(options)
    {
    }

    public DbSet<Cliente> Clientes => Set<Cliente>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Cliente>(entity =>
        {
            entity.ToTable("Clientes");
            entity.HasKey(cliente => cliente.Id);
            entity.Property(cliente => cliente.Identificacion).HasMaxLength(30);
            entity.Property(cliente => cliente.Nombres).HasMaxLength(100);
            entity.Property(cliente => cliente.Apellidos).HasMaxLength(100);
            entity.Property(cliente => cliente.Correo).HasMaxLength(150);
            entity.Property(cliente => cliente.Telefono).HasMaxLength(30);
        });
    }
}
