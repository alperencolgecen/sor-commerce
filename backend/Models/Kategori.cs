using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Kategori
{
    public int Id { get; set; }

    [Required, MaxLength(100)]
    public string Ad { get; set; }

    [MaxLength(100)]
    public string Ikon { get; set; }

    [MaxLength(50)]
    public string Renk { get; set; }
}
