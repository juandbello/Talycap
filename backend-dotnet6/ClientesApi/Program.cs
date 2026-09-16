using ClientesApi.Data;

using ClientesApi.Repositories;

using ClientesApi.Services;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<ClientesDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBClientes")));
builder.Services.AddScoped<IClienteRepository, ClienteRepository>();
builder.Services.AddScoped<IClienteService, ClienteService>();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();
app.UseAuthorization();
app.MapControllers();

app.Run();
