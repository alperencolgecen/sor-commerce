using backend.Data;
using backend.Services;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Tests;

public class TestStartup
{
    public void ConfigureServices(IServiceCollection services)
    {
        services.AddControllersWithViews()
            .AddApplicationPart(typeof(backend.Controllers.Api.UrunController).Assembly);
        services.AddEndpointsApiExplorer();
        services.AddDbContext<AppDbContext>(options =>
            options.UseInMemoryDatabase("TestDb"));
        services.AddAuthentication();
        services.AddAuthorization();
        services.AddScoped<ISmsService, SmsService>();
        services.AddScoped<IEmailService, EmailService>();
        services.AddCors(o => o.AddPolicy("ReactPolicy", b =>
            b.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));
    }

    public void Configure(IApplicationBuilder app)
    {
        app.UseRouting();
        app.UseCors("ReactPolicy");
        app.UseAuthentication();
        app.UseAuthorization();
        app.UseEndpoints(endpoints =>
        {
            endpoints.MapControllers();
        });
    }
}

public abstract class IntegrationTestBase : IDisposable
{
    protected readonly HttpClient Client;
    private readonly TestServer _server;

    protected IntegrationTestBase()
    {
        _server = new TestServer(new WebHostBuilder().UseStartup<TestStartup>());
        Client = _server.CreateClient();
    }

    public void Dispose()
    {
        Client.Dispose();
        _server.Dispose();
    }
}
