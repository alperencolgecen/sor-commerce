using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class SiparisDetay
{
    public int Id { get; set; }
    public int SiparisId { get; set; }
    public int UrunId { get; set; }

    [MaxLength(200)]
    public string UrunAd { get; set; }

    [MaxLength(500)]
    public string UrunGorsel { get; set; }

    [Range(1, int.MaxValue)]
    public int Adet { get; set; }

    [Range(0, double.MaxValue)]
    public decimal BirimFiyat { get; set; }

    public Siparis Siparis { get; set; }
}
