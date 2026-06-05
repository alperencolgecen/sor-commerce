using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class Siparis
{
    public int Id { get; set; }
    public int KullaniciId { get; set; }
    public DateTime Tarih { get; set; }

    [Range(0, double.MaxValue)]
    public decimal Toplam { get; set; }

    [MaxLength(50)]
    public string Durum { get; set; }

    public List<SiparisDetay> Detaylar { get; set; } = new();
}
