using ClientesApi.DTOs;
using ClientesApi.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
namespace ClientesApi.Api.Controllers;
[ApiController]
[Route("api/clientes")]
public sealed class ClientesController : ControllerBase { private readonly IClienteService _clienteService; public ClientesController(IClienteService clienteService) => _clienteService = clienteService; [HttpGet("{identificacion}")] [ProducesResponseType(typeof(ClienteDto), StatusCodes.Status200OK)] [ProducesResponseType(StatusCodes.Status404NotFound)] public async Task<ActionResult<ClienteDto>> Obtener(string identificacion, CancellationToken cancellationToken) { var cliente = await _clienteService.ObtenerPorIdentificacionAsync(identificacion, cancellationToken); return cliente is null ? NotFound(new { mensaje = "Cliente no encontrado." }) : Ok(cliente); } }
