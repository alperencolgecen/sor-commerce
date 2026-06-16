using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Adres
{
    public int Id { get; set; }

    public int KullaniciId { get; set; }

    [Required, MaxLength(100)]
    public string Baslik { get; set; }

    [Required, MaxLength(200)]
    public string Sehir { get; set; }

    [MaxLength(200)]
    public string Ilce { get; set; }

    [Required, MaxLength(500)]
    public string AdresDetay { get; set; }

    [MaxLength(20)]
    public string Telefon { get; set; }

    public bool Varsayilan { get; set; }
}
