using System.ComponentModel.DataAnnotations;

namespace backend.Models;

public class AppSetting
{
    [Key]
    [MaxLength(100)]
    public string Anahtar { get; set; }

    [MaxLength(2000)]
    public string Deger { get; set; }
}
