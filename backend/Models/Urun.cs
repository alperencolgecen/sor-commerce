using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Urun
{
    public int Id { get; set; }

    [Required, MaxLength(200)]
    public string Ad { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Fiyat { get; set; }

    public decimal IndirimFiyat { get; set; }
    public int IndirimYuzde { get; set; }
    public double Puan { get; set; }
    public int YorumSayisi { get; set; }

    [MaxLength(100)]
    public string Kategori { get; set; }

    [MaxLength(100)]
    public string AltKategori { get; set; }

    [MaxLength(100)]
    public string UrunTuru { get; set; }

    [MaxLength(100)]
    public string Marka { get; set; }

    [MaxLength(500)]
    public string Gorsel { get; set; }

    public bool UcretsizKargo { get; set; }
    public bool Stokta { get; set; }
    public int StokMiktari { get; set; } = 0;

    public int TaksitSayisi { get; set; }
    public decimal TaksitAylikFiyat { get; set; }

    [MaxLength(2000)]
    public string Aciklama { get; set; }
}
