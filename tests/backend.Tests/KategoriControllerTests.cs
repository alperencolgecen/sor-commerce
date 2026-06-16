using System.Net;
using System.Net.Http.Json;
using backend.Models;

namespace backend.Tests;

public class KategoriControllerTests : IntegrationTestBase
{
    [Fact]
    public async Task GetAll_ReturnsCategories()
    {
        var response = await Client.GetAsync("/api/kategori");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);

        var result = await response.Content.ReadFromJsonAsync<List<Kategori>>();
        Assert.NotNull(result);
    }

    [Fact]
    public async Task GetById_EmptyDb_ReturnsNotFound()
    {
        var response = await Client.GetAsync("/api/kategori/1");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }

    [Fact]
    public async Task GetById_NotFound_Returns404()
    {
        var response = await Client.GetAsync("/api/kategori/999");
        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
    }
}
