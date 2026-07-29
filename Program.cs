using Microsoft.EntityFrameworkCore;
using MiniCoreBancario.Data;
using MiniCoreBancario.Services;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Entity Framework Core with SQLite
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register the application services
builder.Services.AddScoped<ICuentasService, CuentasService>();

// Configurar CORS para producción
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.AllowAnyOrigin() // Permitir Vercel (cualquier origen)
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

var app = builder.Build();

app.UseCors("AllowFrontend");

// Exponemos la interfaz gráfica de la API (Scalar) en cualquier entorno (incluyendo Producción) 
// para que los reclutadores puedan verla en Render.
app.MapOpenApi();
app.MapScalarApiReference(options => 
{
    options.WithTitle("MiniCoreBancario API");
});

app.UseHttpsRedirection();

app.MapControllers();

app.Run();
