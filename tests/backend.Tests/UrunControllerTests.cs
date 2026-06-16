using System.Net;
using System.Net.Http.Json;
using backend.Data;
using backend.Models;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Tests;

public class UrunControllerTests : IntegrationTestBase
{
    [Fact]
    public async Task GetAll_ReturnsPagedResponse()
    {
        var response = await Client.GetAsync("/api/urun");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<PagedResponse<Urun>>();
        Assert.NotNull(result);
        Assert.NotNull(result.Items);
        Assert.True(result.Total >= 0);
        Assert.Equal(1, result.Page);
        Assert.Equal(20, result.Limit);
    }

    [Fact]
    public async Task GetById_EmptyDb_ReturnsNotFound()
    {
        var response = await Client.GetAsync("/api/urun/1");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetById_NotFound_Returns404()
    {
        var response = await Client.GetAsync("/api/urun/9999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetByKategori_ReturnsPagedResponse()
    {
        var response = await Client.GetAsync("/api/urun/kategori/kadin");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<PagedResponse<Urun>>();
        Assert.NotNull(result);
    }
}
