using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Kullanici
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Ad { get; set; }

    [Required, MaxLength(200)]
    public string Email { get; set; }

    [Required, MaxLength(500)]
    public string SifreHash { get; set; }
}
