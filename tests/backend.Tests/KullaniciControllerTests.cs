using System.Net;
using System.Net.Http.Json;

namespace backend.Tests;

public class KullaniciControllerTests : IntegrationTestBase
{
    [Fact]
    public async Task Kayit_ValidUser_ReturnsOk()
    {
        var user = new { Ad = "Test", Email = "test@example.com", SifreHash = "123456" };
        var response = await Client.PostAsJsonAsync("/api/kullanici/kayit", user);
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Kayit_DuplicateEmail_ReturnsBadRequest()
    {
        var user = new { Ad = "Test", Email = "dupe@example.com", SifreHash = "123456" };
        await Client.PostAsJsonAsync("/api/kullanici/kayit", user);
        var response = await Client.PostAsJsonAsync("/api/kullanici/kayit", user);
        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
    }

    [Fact]
    public async Task Giris_ValidCredentials_ReturnsOk()
    {
        var email = "login@example.com";
        var password = "mypassword";
        await Client.PostAsJsonAsync("/api/kullanici/kayit", new { Ad = "Test", Email = email, SifreHash = password });

        var response = await Client.PostAsJsonAsync("/api/kullanici/giris", new { Ad = "Test", Email = email, SifreHash = password });
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
    }

    [Fact]
    public async Task Giris_WrongPassword_ReturnsUnauthorized()
    {
        var email = "wrongpw@example.com";
        await Client.PostAsJsonAsync("/api/kullanici/kayit", new { Ad = "Test", Email = email, SifreHash = "correct" });

        var response = await Client.PostAsJsonAsync("/api/kullanici/giris", new { Ad = "Test", Email = email, SifreHash = "wrong" });
        Assert.Equal(HttpStatusCode.Unauthorized, response.StatusCode);
    }
}
