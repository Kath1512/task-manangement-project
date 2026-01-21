using Mapster;
using Microsoft.EntityFrameworkCore;
using Npgsql;
using TaskManagement.Mappings;
using TaskManagement.Models;
using TaskManagement.Repositories;
using TaskManagement.Repositories.Interfaces;
using TaskManagement.Services;
using TaskManagement.Services.Interfaces;


var builder = WebApplication.CreateBuilder(args);

MappingConfig.RegisterMappings();

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")!;
builder.Services.AddDbContext<TaskmanagementContext>(options => options.UseNpgsql(connectionString,
                                                        o =>
                                                        {
                                                            o.MapEnum<UserRole>("user_role");
                                                            o.MapEnum<TypeStatus>("type_status");
                                                        }));
builder.Services.AddStackExchangeRedisCache(option => {
    option.Configuration = builder.Configuration.GetConnectionString("RedisConnection");
    option.InstanceName = "User_";
});



builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IProjectService, ProjectService>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IProjectRepository, ProjectRepository>();
builder.Services.AddScoped<ICacheService, CacheService>();

builder.Logging.ClearProviders();
builder.Logging.AddConsole();


//add cors
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()   // allow any domain
              .AllowAnyMethod()   // allow GET, POST, PUT, DELETE, etc.
              .AllowAnyHeader();  // allow any headers
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseHttpsRedirection();

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

app.Run();
