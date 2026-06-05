using Microsoft.EntityFrameworkCore;
using backend.Models;

namespace backend.Data;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<Urun> Urunler { get; set; }
    public DbSet<Kategori> Kategoriler { get; set; }
    public DbSet<Kullanici> Kullanicilar { get; set; }
    public DbSet<Siparis> Siparisler { get; set; }
    public DbSet<SiparisDetay> SiparisDetaylari { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<SiparisDetay>()
            .HasOne(sd => sd.Siparis)
            .WithMany(s => s.Detaylar)
            .HasForeignKey(sd => sd.SiparisId);

        modelBuilder.Entity<Urun>(entity =>
        {
            entity.Property(e => e.Fiyat).HasColumnType("decimal(18,2)");
            entity.Property(e => e.IndirimFiyat).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Siparis>(entity =>
        {
            entity.Property(e => e.Toplam).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<SiparisDetay>(entity =>
        {
            entity.Property(e => e.BirimFiyat).HasColumnType("decimal(18,2)");
        });

        modelBuilder.Entity<Kategori>().HasData(
            new Kategori { Id = 1, Ad = "Kadın", Ikon = "fas fa-female", Renk = "#EC4899" },
            new Kategori { Id = 2, Ad = "Erkek", Ikon = "fas fa-male", Renk = "#1E3A5F" },
            new Kategori { Id = 3, Ad = "Anne & Çocuk", Ikon = "fas fa-baby", Renk = "#F59E0B" },
            new Kategori { Id = 4, Ad = "Ev & Yaşam", Ikon = "fas fa-couch", Renk = "#10B981" },
            new Kategori { Id = 5, Ad = "Süpermarket", Ikon = "fas fa-shopping-basket", Renk = "#0EA5E9" },
            new Kategori { Id = 6, Ad = "Kozmetik", Ikon = "fas fa-gem", Renk = "#8B5CF6" },
            new Kategori { Id = 7, Ad = "Ayakkabı & Çanta", Ikon = "fas fa-shoe-prints", Renk = "#F43F5E" },
            new Kategori { Id = 8, Ad = "Elektronik", Ikon = "fas fa-laptop", Renk = "#2563EB" },
            new Kategori { Id = 9, Ad = "Saat & Aksesuar", Ikon = "fas fa-clock", Renk = "#78716C" },
            new Kategori { Id = 10, Ad = "Spor & Outdoor", Ikon = "fas fa-running", Renk = "#EF4444" }
        );

        modelBuilder.Entity<Urun>().HasData(
            // Kadın
            new Urun { Id = 1, Ad = "Koton Siyah Kısa Elbise", Fiyat = 599, IndirimFiyat = 399, IndirimYuzde = 33, Puan = 4.1, YorumSayisi = 89, Kategori = "kadin", AltKategori = "Elbise", Marka = "Koton", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 2, Ad = "Mavi Beyaz Keten Gömlek", Fiyat = 449, IndirimFiyat = 349, IndirimYuzde = 22, Puan = 4.3, YorumSayisi = 56, Kategori = "kadin", AltKategori = "Üst Giyim", Marka = "Mavi", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 3, Ad = "Derimod Siyah Koton Pantolon", Fiyat = 699, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.2, YorumSayisi = 34, Kategori = "kadin", AltKategori = "Alt Giyim", Marka = "Derimod", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 4, Ad = "Tommy Hilfiger Lacivert Kaban", Fiyat = 4999, IndirimFiyat = 3999, IndirimYuzde = 20, Puan = 4.6, YorumSayisi = 23, Kategori = "kadin", AltKategori = "Dış Giyim", Marka = "Tommy Hilfiger", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 5, Ad = "Penti Siyah Külotlu Çorap 3lü", Fiyat = 89, IndirimFiyat = 69, IndirimYuzde = 22, Puan = 4.0, YorumSayisi = 312, Kategori = "kadin", AltKategori = "İç Giyim", Marka = "Penti", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 6, Ad = "Yüzme Bikini Takımı", Fiyat = 299, IndirimFiyat = 199, IndirimYuzde = 33, Puan = 4.1, YorumSayisi = 78, Kategori = "kadin", AltKategori = "Plaj", Marka = "Mudo", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Erkek
            new Urun { Id = 7, Ad = "Polo Mavi Klasik Gömlek", Fiyat = 899, IndirimFiyat = 749, IndirimYuzde = 17, Puan = 4.2, YorumSayisi = 78, Kategori = "erkek", AltKategori = "Gömlek", Marka = "Polo", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 8, Ad = "Mavi Jeans Siyah Dar Kot", Fiyat = 799, IndirimFiyat = 599, IndirimYuzde = 25, Puan = 4.2, YorumSayisi = 112, Kategori = "erkek", AltKategori = "Alt Giyim", Marka = "Mavi", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 9, Ad = "Koton Siyah Erkek Sweatshirt", Fiyat = 349, IndirimFiyat = 249, IndirimYuzde = 29, Puan = 4.3, YorumSayisi = 67, Kategori = "erkek", AltKategori = "Üst Giyim", Marka = "Koton", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 10, Ad = "US POLO Lacivert Kaban", Fiyat = 2999, IndirimFiyat = 2499, IndirimYuzde = 17, Puan = 4.4, YorumSayisi = 34, Kategori = "erkek", AltKategori = "Dış Giyim", Marka = "US POLO", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 11, Ad = "Damat Tween Smokin Takım", Fiyat = 5999, IndirimFiyat = 4999, IndirimYuzde = 17, Puan = 4.5, YorumSayisi = 12, Kategori = "erkek", AltKategori = "Takım Elbise", Marka = "Damat Tween", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 12, Ad = "Pierre Cardin Kravat Seti", Fiyat = 199, IndirimFiyat = 149, IndirimYuzde = 25, Puan = 4.0, YorumSayisi = 89, Kategori = "erkek", AltKategori = "Aksesuar", Marka = "Pierre Cardin", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Anne & Çocuk
            new Urun { Id = 13, Ad = "Prima Bebek Bezi 4 Numara 84lü", Fiyat = 279, IndirimFiyat = 219, IndirimYuzde = 22, Puan = 4.7, YorumSayisi = 1245, Kategori = "anne-cocuk", AltKategori = "Bebek Bezi", Marka = "Prima", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 14, Ad = "Aptamil 2 Bebek Maması 800g", Fiyat = 349, IndirimFiyat = 299, IndirimYuzde = 14, Puan = 4.6, YorumSayisi = 890, Kategori = "anne-cocuk", AltKategori = "Bebek Maması", Marka = "Aptamil", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 15, Ad = "Lego Classic Yaratıcı Kutu", Fiyat = 599, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.8, YorumSayisi = 234, Kategori = "anne-cocuk", AltKategori = "Oyuncak", Marka = "Lego", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 16, Ad = "Nike Çocuk Spor Ayakkabı", Fiyat = 1299, IndirimFiyat = 999, IndirimYuzde = 23, Puan = 4.4, YorumSayisi = 67, Kategori = "anne-cocuk", AltKategori = "Çocuk Giyim", Marka = "Nike", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 17, Ad = "Mustela Bebek Bakım Seti", Fiyat = 399, IndirimFiyat = 329, IndirimYuzde = 18, Puan = 4.5, YorumSayisi = 456, Kategori = "anne-cocuk", AltKategori = "Bebek Bakım", Marka = "Mustela", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Ev & Yaşam
            new Urun { Id = 18, Ad = "Philips Airfryer XXL 7L", Fiyat = 5999, IndirimFiyat = 4999, IndirimYuzde = 17, Puan = 4.6, YorumSayisi = 234, Kategori = "ev-yasam", AltKategori = "Mutfak", Marka = "Philips", Gorsel = "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 19, Ad = "Bellona 3lü Koltuk Takımı", Fiyat = 24999, IndirimFiyat = 19999, IndirimYuzde = 20, Puan = 4.5, YorumSayisi = 67, Kategori = "ev-yasam", AltKategori = "Mobilya", Marka = "Bellona", Gorsel = "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 20, Ad = "Koçtaş LED Aydınlatma Panel", Fiyat = 249, IndirimFiyat = 199, IndirimYuzde = 20, Puan = 4.2, YorumSayisi = 156, Kategori = "ev-yasam", AltKategori = "Aydınlatma", Marka = "Koçtaş", Gorsel = "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 21, Ad = "Karaca Tuvalet Takımı 6 Parça", Fiyat = 899, IndirimFiyat = 749, IndirimYuzde = 17, Puan = 4.3, YorumSayisi = 89, Kategori = "ev-yasam", AltKategori = "Banyo", Marka = "Karaca", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 22, Ad = "Tefal Titanium Tava Seti 5 Parça", Fiyat = 2499, IndirimFiyat = 1999, IndirimYuzde = 20, Puan = 4.5, YorumSayisi = 312, Kategori = "ev-yasam", AltKategori = "Mutfak", Marka = "Tefal", Gorsel = "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 23, Ad = "Madame Coco Dekoratif Vazo", Fiyat = 179, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.1, YorumSayisi = 45, Kategori = "ev-yasam", AltKategori = "Dekorasyon", Marka = "Madame Coco", Gorsel = "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 24, Ad = "Nevşah Yatak Odası Tekstil Seti", Fiyat = 1499, IndirimFiyat = 1199, IndirimYuzde = 20, Puan = 4.4, YorumSayisi = 78, Kategori = "ev-yasam", AltKategori = "Yatak Odası", Marka = "Nevşah", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            // Süpermarket
            new Urun { Id = 25, Ad = "Ülker Çikolatalı Gofret 12li", Fiyat = 49, IndirimFiyat = 39, IndirimYuzde = 20, Puan = 4.3, YorumSayisi = 2345, Kategori = "supermarket", AltKategori = "Gıda", Marka = "Ülker", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 26, Ad = "Coca Cola 1.5L 6lı Paket", Fiyat = 89, IndirimFiyat = 69, IndirimYuzde = 22, Puan = 4.1, YorumSayisi = 1234, Kategori = "supermarket", AltKategori = "İçecek", Marka = "Coca Cola", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 27, Ad = "Domestos Çamaşır Suyu 2L", Fiyat = 39, IndirimFiyat = 29, IndirimYuzde = 26, Puan = 4.2, YorumSayisi = 567, Kategori = "supermarket", AltKategori = "Temizlik", Marka = "Domestos", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 28, Ad = "Selpak Tuvalet Kağıdı 32li", Fiyat = 149, IndirimFiyat = 119, IndirimYuzde = 20, Puan = 4.4, YorumSayisi = 890, Kategori = "supermarket", AltKategori = "Kağıt Ürünleri", Marka = "Selpak", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 29, Ad = "Fairy Bulaşık Deterjanı 700ml", Fiyat = 69, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.3, YorumSayisi = 678, Kategori = "supermarket", AltKategori = "Ev Bakım", Marka = "Fairy", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Kozmetik
            new Urun { Id = 30, Ad = "MAC Studio Fix Fondöten", Fiyat = 899, IndirimFiyat = 749, IndirimYuzde = 17, Puan = 4.5, YorumSayisi = 312, Kategori = "kozmetik", AltKategori = "Makyaj", Marka = "MAC", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 31, Ad = "L'Oréal Paris Saç Boyası", Fiyat = 249, IndirimFiyat = 199, IndirimYuzde = 20, Puan = 4.1, YorumSayisi = 567, Kategori = "kozmetik", AltKategori = "Saç Bakım", Marka = "L'Oréal", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 32, Ad = "Nivea Krem 400ml Nemlendirici", Fiyat = 179, IndirimFiyat = 149, IndirimYuzde = 17, Puan = 4.3, YorumSayisi = 890, Kategori = "kozmetik", AltKategori = "Cilt Bakım", Marka = "Nivea", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 33, Ad = "Armani Beauty Kırmızı Ruj", Fiyat = 699, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.4, YorumSayisi = 156, Kategori = "kozmetik", AltKategori = "Makyaj", Marka = "Armani", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = false },
            new Urun { Id = 34, Ad = "Dior Sauvage Parfüm 100ml", Fiyat = 2499, IndirimFiyat = 2199, IndirimYuzde = 12, Puan = 4.7, YorumSayisi = 234, Kategori = "kozmetik", AltKategori = "Parfüm", Marka = "Dior", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 35, Ad = "Nivea Vücut Losyonu 400ml", Fiyat = 139, IndirimFiyat = 99, IndirimYuzde = 29, Puan = 4.2, YorumSayisi = 678, Kategori = "kozmetik", AltKategori = "Vücut Bakım", Marka = "Nivea", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Ayakkabı & Çanta
            new Urun { Id = 36, Ad = "Lacoste Beyaz Sneaker", Fiyat = 2999, IndirimFiyat = 2499, IndirimYuzde = 17, Puan = 4.4, YorumSayisi = 45, Kategori = "ayakkabi-canta", AltKategori = "Kadın Ayakkabı", Marka = "Lacoste", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 37, Ad = "Diesel Siyah Spor Ayakkabı", Fiyat = 3499, IndirimFiyat = 2499, IndirimYuzde = 29, Puan = 4.5, YorumSayisi = 34, Kategori = "ayakkabi-canta", AltKategori = "Erkek Ayakkabı", Marka = "Diesel", Gorsel = "/IMG/urun/Diesel-Spor-Ayakkab-_1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 38, Ad = "Nike Air Max 90 Beyaz", Fiyat = 3299, IndirimFiyat = 2799, IndirimYuzde = 15, Puan = 4.3, YorumSayisi = 156, Kategori = "ayakkabi-canta", AltKategori = "Spor Ayakkabı", Marka = "Nike", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 39, Ad = "Michael Kors Siyah Çanta", Fiyat = 4999, IndirimFiyat = 3999, IndirimYuzde = 20, Puan = 4.6, YorumSayisi = 89, Kategori = "ayakkabi-canta", AltKategori = "Çanta", Marka = "Michael Kors", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 40, Ad = "Crocs Terlik Siyah", Fiyat = 499, IndirimFiyat = 399, IndirimYuzde = 20, Puan = 4.2, YorumSayisi = 234, Kategori = "ayakkabi-canta", AltKategori = "Terlik", Marka = "Crocs", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Elektronik
            new Urun { Id = 41, Ad = "iPhone 15 Pro Max 256GB", Fiyat = 59999, IndirimFiyat = 54999, IndirimYuzde = 8, Puan = 4.5, YorumSayisi = 128, Kategori = "elektronik", AltKategori = "Telefon", Marka = "Apple", Gorsel = "/IMG/urun/apple-iphone-15-pro-max_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 42, Ad = "Samsung Galaxy S24 Ultra 512GB", Fiyat = 52999, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.6, YorumSayisi = 95, Kategori = "elektronik", AltKategori = "Telefon", Marka = "Samsung", Gorsel = "/IMG/urun/Samsung-Galaxy-S24-Ultra.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 43, Ad = "Apple MacBook Pro M3 Max 16\"", Fiyat = 89999, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.7, YorumSayisi = 67, Kategori = "elektronik", AltKategori = "Bilgisayar", Marka = "Apple", Gorsel = "/IMG/urun/Apple-MacBook-Pro-M3_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = false },
            new Urun { Id = 44, Ad = "Dell XPS 15 OLED i9 32GB", Fiyat = 45999, IndirimFiyat = 42999, IndirimYuzde = 7, Puan = 4.4, YorumSayisi = 45, Kategori = "elektronik", AltKategori = "Bilgisayar", Marka = "Dell", Gorsel = "/IMG/urun/Dell-XPS-15_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 45, Ad = "Samsung Galaxy Tab S9 FE", Fiyat = 15999, IndirimFiyat = 13999, IndirimYuzde = 13, Puan = 4.3, YorumSayisi = 89, Kategori = "elektronik", AltKategori = "Tablet", Marka = "Samsung", Gorsel = "/IMG/urun/Galaxy-Tab-S9-FE_1__1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 46, Ad = "Sony WH-1000XM5 Gürültü Önleyici", Fiyat = 8499, IndirimFiyat = 7499, IndirimYuzde = 12, Puan = 4.8, YorumSayisi = 256, Kategori = "elektronik", AltKategori = "Kulaklık", Marka = "Sony", Gorsel = "/IMG/urun/Sony-WH-1000XM5_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 47, Ad = "Apple AirPods Pro 2. Nesil", Fiyat = 7999, IndirimFiyat = 7299, IndirimYuzde = 9, Puan = 4.6, YorumSayisi = 312, Kategori = "elektronik", AltKategori = "Kulaklık", Marka = "Apple", Gorsel = "/IMG/urun/Apple-AirPods-Pro-2-_1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 48, Ad = "Sony PlayStation 5 Pro 2TB", Fiyat = 29999, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.9, YorumSayisi = 423, Kategori = "elektronik", AltKategori = "Oyun", Marka = "Sony", Gorsel = "/IMG/urun/PlayStation-5-Pro_1-removebg-preview.png", UcretsizKargo = true, Stokta = false },
            new Urun { Id = 49, Ad = "Samsung 75\" Neo QLED 8K TV", Fiyat = 149999, IndirimFiyat = 129999, IndirimYuzde = 13, Puan = 4.7, YorumSayisi = 67, Kategori = "elektronik", AltKategori = "Telefon", Marka = "Samsung", Gorsel = "/IMG/urun/Samsung-75-_1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 50, Ad = "Bose QuietComfort Ultra Kulaklık", Fiyat = 9499, IndirimFiyat = 8499, IndirimYuzde = 11, Puan = 4.5, YorumSayisi = 134, Kategori = "elektronik", AltKategori = "Kulaklık", Marka = "Bose", Gorsel = "/IMG/urun/Bose-QuietComfort-Ultra_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            // Saat & Aksesuar
            new Urun { Id = 51, Ad = "Casio G-Shock Dijital Kol Saati", Fiyat = 1499, IndirimFiyat = 1199, IndirimYuzde = 20, Puan = 4.4, YorumSayisi = 234, Kategori = "saat-aksesuar", AltKategori = "Kol Saati", Marka = "Casio", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 52, Ad = "Swiss Canon Altın Kolye", Fiyat = 2999, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.6, YorumSayisi = 78, Kategori = "saat-aksesuar", AltKategori = "Takı", Marka = "Swiss Canon", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 53, Ad = "Polaroid Güneş Gözlüğü", Fiyat = 699, IndirimFiyat = 499, IndirimYuzde = 29, Puan = 4.2, YorumSayisi = 145, Kategori = "saat-aksesuar", AltKategori = "Gözlük", Marka = "Polaroid", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 54, Ad = "Hugo Boss Siyah Kemer", Fiyat = 899, IndirimFiyat = 749, IndirimYuzde = 17, Puan = 4.3, YorumSayisi = 67, Kategori = "saat-aksesuar", AltKategori = "Kemer", Marka = "Hugo Boss", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 55, Ad = "Pierre Cardin Erkek Cüzdan", Fiyat = 399, IndirimFiyat = 299, IndirimYuzde = 25, Puan = 4.1, YorumSayisi = 156, Kategori = "saat-aksesuar", AltKategori = "Cüzdan", Marka = "Pierre Cardin", Gorsel = "/IMG/urun/Polo_1-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            // Spor & Outdoor
            new Urun { Id = 56, Ad = "Adidas Originals Erkek Eşofman", Fiyat = 1299, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.3, YorumSayisi = 67, Kategori = "spor-outdoor", AltKategori = "Spor Giyim", Marka = "Adidas", Gorsel = "/IMG/urun/Diesel-Spor-Ayakkab-_1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 57, Ad = "Under Armour Spor Tayt Siyah", Fiyat = 899, IndirimFiyat = 599, IndirimYuzde = 33, Puan = 4.3, YorumSayisi = 78, Kategori = "spor-outdoor", AltKategori = "Spor Giyim", Marka = "Under Armour", Gorsel = "/IMG/urun/Diesel-Spor-Ayakkab-_1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 58, Ad = "Nike Yoga Mat 6mm", Fiyat = 599, IndirimFiyat = 0, IndirimYuzde = 0, Puan = 4.4, YorumSayisi = 234, Kategori = "spor-outdoor", AltKategori = "Fitness", Marka = "Nike", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true },
            new Urun { Id = 59, Ad = "The North Face Sırt Çantası 50L", Fiyat = 2999, IndirimFiyat = 2499, IndirimYuzde = 17, Puan = 4.7, YorumSayisi = 145, Kategori = "spor-outdoor", AltKategori = "Kamp", Marka = "The North Face", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 60, Ad = "Salomon Su Geçirmez Mont", Fiyat = 3999, IndirimFiyat = 2999, IndirimYuzde = 25, Puan = 4.6, YorumSayisi = 56, Kategori = "spor-outdoor", AltKategori = "Kamp", Marka = "Salomon", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = true, Stokta = true },
            new Urun { Id = 61, Ad = "Bisiklet Kaskı MIPS Korumalı", Fiyat = 899, IndirimFiyat = 749, IndirimYuzde = 17, Puan = 4.5, YorumSayisi = 89, Kategori = "spor-outdoor", AltKategori = "Bisiklet", Marka = "Salcano", Gorsel = "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", UcretsizKargo = false, Stokta = true }
        );
    }
}
