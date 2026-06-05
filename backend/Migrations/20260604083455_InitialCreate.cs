using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Kategoriler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Ikon = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Renk = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kategoriler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Kullanicilar",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Email = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    SifreHash = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Kullanicilar", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Siparisler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    KullaniciId = table.Column<int>(type: "int", nullable: false),
                    Tarih = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Toplam = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Durum = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Siparisler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Urunler",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Ad = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    Fiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IndirimFiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IndirimYuzde = table.Column<int>(type: "int", nullable: false),
                    Puan = table.Column<double>(type: "float", nullable: false),
                    YorumSayisi = table.Column<int>(type: "int", nullable: false),
                    Kategori = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    AltKategori = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Marka = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    Gorsel = table.Column<string>(type: "nvarchar(500)", maxLength: 500, nullable: true),
                    UcretsizKargo = table.Column<bool>(type: "bit", nullable: false),
                    Stokta = table.Column<bool>(type: "bit", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Urunler", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "SiparisDetaylari",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SiparisId = table.Column<int>(type: "int", nullable: false),
                    UrunId = table.Column<int>(type: "int", nullable: false),
                    Adet = table.Column<int>(type: "int", nullable: false),
                    BirimFiyat = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SiparisDetaylari", x => x.Id);
                    table.ForeignKey(
                        name: "FK_SiparisDetaylari_Siparisler_SiparisId",
                        column: x => x.SiparisId,
                        principalTable: "Siparisler",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Kategoriler",
                columns: new[] { "Id", "Ad", "Ikon", "Renk" },
                values: new object[,]
                {
                    { 1, "Kadın", "fas fa-female", "#EC4899" },
                    { 2, "Erkek", "fas fa-male", "#1E3A5F" },
                    { 3, "Anne & Çocuk", "fas fa-baby", "#F59E0B" },
                    { 4, "Ev & Yaşam", "fas fa-couch", "#10B981" },
                    { 5, "Süpermarket", "fas fa-shopping-basket", "#0EA5E9" },
                    { 6, "Kozmetik", "fas fa-gem", "#8B5CF6" },
                    { 7, "Ayakkabı & Çanta", "fas fa-shoe-prints", "#F43F5E" },
                    { 8, "Elektronik", "fas fa-laptop", "#2563EB" },
                    { 9, "Saat & Aksesuar", "fas fa-clock", "#78716C" },
                    { 10, "Spor & Outdoor", "fas fa-running", "#EF4444" }
                });

            migrationBuilder.InsertData(
                table: "Urunler",
                columns: new[] { "Id", "Ad", "AltKategori", "Fiyat", "Gorsel", "IndirimFiyat", "IndirimYuzde", "Kategori", "Marka", "Puan", "Stokta", "UcretsizKargo", "YorumSayisi" },
                values: new object[,]
                {
                    { 1, "Koton Siyah Kısa Elbise", "Elbise", 599m, "/IMG/urun/Polo_1-removebg-preview.png", 399m, 33, "kadin", "Koton", 4.0999999999999996, true, false, 89 },
                    { 2, "Mavi Beyaz Keten Gömlek", "Üst Giyim", 449m, "/IMG/urun/Polo_1-removebg-preview.png", 349m, 22, "kadin", "Mavi", 4.2999999999999998, true, false, 56 },
                    { 3, "Derimod Siyah Koton Pantolon", "Alt Giyim", 699m, "/IMG/urun/Polo_1-removebg-preview.png", 0m, 0, "kadin", "Derimod", 4.2000000000000002, true, false, 34 },
                    { 4, "Tommy Hilfiger Lacivert Kaban", "Dış Giyim", 4999m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 3999m, 20, "kadin", "Tommy Hilfiger", 4.5999999999999996, true, true, 23 },
                    { 5, "Penti Siyah Külotlu Çorap 3lü", "İç Giyim", 89m, "/IMG/urun/Polo_1-removebg-preview.png", 69m, 22, "kadin", "Penti", 4.0, true, false, 312 },
                    { 6, "Yüzme Bikini Takımı", "Plaj", 299m, "/IMG/urun/Polo_1-removebg-preview.png", 199m, 33, "kadin", "Mudo", 4.0999999999999996, true, false, 78 },
                    { 7, "Polo Mavi Klasik Gömlek", "Gömlek", 899m, "/IMG/urun/Polo_1-removebg-preview.png", 749m, 17, "erkek", "Polo", 4.2000000000000002, true, false, 78 },
                    { 8, "Mavi Jeans Siyah Dar Kot", "Alt Giyim", 799m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 599m, 25, "erkek", "Mavi", 4.2000000000000002, true, false, 112 },
                    { 9, "Koton Siyah Erkek Sweatshirt", "Üst Giyim", 349m, "/IMG/urun/Polo_1-removebg-preview.png", 249m, 29, "erkek", "Koton", 4.2999999999999998, true, false, 67 },
                    { 10, "US POLO Lacivert Kaban", "Dış Giyim", 2999m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 2499m, 17, "erkek", "US POLO", 4.4000000000000004, true, true, 34 },
                    { 11, "Damat Tween Smokin Takım", "Takım Elbise", 5999m, "/IMG/urun/Polo_1-removebg-preview.png", 4999m, 17, "erkek", "Damat Tween", 4.5, true, true, 12 },
                    { 12, "Pierre Cardin Kravat Seti", "Aksesuar", 199m, "/IMG/urun/Polo_1-removebg-preview.png", 149m, 25, "erkek", "Pierre Cardin", 4.0, true, false, 89 },
                    { 13, "Prima Bebek Bezi 4 Numara 84lü", "Bebek Bezi", 279m, "/IMG/urun/Polo_1-removebg-preview.png", 219m, 22, "anne-cocuk", "Prima", 4.7000000000000002, true, true, 1245 },
                    { 14, "Aptamil 2 Bebek Maması 800g", "Bebek Maması", 349m, "/IMG/urun/Polo_1-removebg-preview.png", 299m, 14, "anne-cocuk", "Aptamil", 4.5999999999999996, true, false, 890 },
                    { 15, "Lego Classic Yaratıcı Kutu", "Oyuncak", 599m, "/IMG/urun/Polo_1-removebg-preview.png", 0m, 0, "anne-cocuk", "Lego", 4.7999999999999998, true, false, 234 },
                    { 16, "Nike Çocuk Spor Ayakkabı", "Çocuk Giyim", 1299m, "/IMG/urun/Polo_1-removebg-preview.png", 999m, 23, "anne-cocuk", "Nike", 4.4000000000000004, true, false, 67 },
                    { 17, "Mustela Bebek Bakım Seti", "Bebek Bakım", 399m, "/IMG/urun/Polo_1-removebg-preview.png", 329m, 18, "anne-cocuk", "Mustela", 4.5, true, false, 456 },
                    { 18, "Philips Airfryer XXL 7L", "Mutfak", 5999m, "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", 4999m, 17, "ev-yasam", "Philips", 4.5999999999999996, true, true, 234 },
                    { 19, "Bellona 3lü Koltuk Takımı", "Mobilya", 24999m, "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", 19999m, 20, "ev-yasam", "Bellona", 4.5, true, true, 67 },
                    { 20, "Koçtaş LED Aydınlatma Panel", "Aydınlatma", 249m, "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", 199m, 20, "ev-yasam", "Koçtaş", 4.2000000000000002, true, false, 156 },
                    { 21, "Karaca Tuvalet Takımı 6 Parça", "Banyo", 899m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 749m, 17, "ev-yasam", "Karaca", 4.2999999999999998, true, false, 89 },
                    { 22, "Tefal Titanium Tava Seti 5 Parça", "Mutfak", 2499m, "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", 1999m, 20, "ev-yasam", "Tefal", 4.5, true, true, 312 },
                    { 23, "Madame Coco Dekoratif Vazo", "Dekorasyon", 179m, "/IMG/urun/Dyson-V15-Detect_1-removebg-preview.png", 0m, 0, "ev-yasam", "Madame Coco", 4.0999999999999996, true, false, 45 },
                    { 24, "Nevşah Yatak Odası Tekstil Seti", "Yatak Odası", 1499m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 1199m, 20, "ev-yasam", "Nevşah", 4.4000000000000004, true, true, 78 },
                    { 25, "Ülker Çikolatalı Gofret 12li", "Gıda", 49m, "/IMG/urun/Polo_1-removebg-preview.png", 39m, 20, "supermarket", "Ülker", 4.2999999999999998, true, false, 2345 },
                    { 26, "Coca Cola 1.5L 6lı Paket", "İçecek", 89m, "/IMG/urun/Polo_1-removebg-preview.png", 69m, 22, "supermarket", "Coca Cola", 4.0999999999999996, true, false, 1234 },
                    { 27, "Domestos Çamaşır Suyu 2L", "Temizlik", 39m, "/IMG/urun/Polo_1-removebg-preview.png", 29m, 26, "supermarket", "Domestos", 4.2000000000000002, true, false, 567 },
                    { 28, "Selpak Tuvalet Kağıdı 32li", "Kağıt Ürünleri", 149m, "/IMG/urun/Polo_1-removebg-preview.png", 119m, 20, "supermarket", "Selpak", 4.4000000000000004, true, true, 890 },
                    { 29, "Fairy Bulaşık Deterjanı 700ml", "Ev Bakım", 69m, "/IMG/urun/Polo_1-removebg-preview.png", 0m, 0, "supermarket", "Fairy", 4.2999999999999998, true, false, 678 },
                    { 30, "MAC Studio Fix Fondöten", "Makyaj", 899m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 749m, 17, "kozmetik", "MAC", 4.5, true, false, 312 },
                    { 31, "L'Oréal Paris Saç Boyası", "Saç Bakım", 249m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 199m, 20, "kozmetik", "L'Oréal", 4.0999999999999996, true, false, 567 },
                    { 32, "Nivea Krem 400ml Nemlendirici", "Cilt Bakım", 179m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 149m, 17, "kozmetik", "Nivea", 4.2999999999999998, true, false, 890 },
                    { 33, "Armani Beauty Kırmızı Ruj", "Makyaj", 699m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 0m, 0, "kozmetik", "Armani", 4.4000000000000004, false, false, 156 },
                    { 34, "Dior Sauvage Parfüm 100ml", "Parfüm", 2499m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 2199m, 12, "kozmetik", "Dior", 4.7000000000000002, true, true, 234 },
                    { 35, "Nivea Vücut Losyonu 400ml", "Vücut Bakım", 139m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 99m, 29, "kozmetik", "Nivea", 4.2000000000000002, true, false, 678 },
                    { 36, "Lacoste Beyaz Sneaker", "Kadın Ayakkabı", 2999m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 2499m, 17, "ayakkabi-canta", "Lacoste", 4.4000000000000004, true, false, 45 },
                    { 37, "Diesel Siyah Spor Ayakkabı", "Erkek Ayakkabı", 3499m, "/IMG/urun/Diesel-Spor-Ayakkab-_1_-removebg-preview.png", 2499m, 29, "ayakkabi-canta", "Diesel", 4.5, true, false, 34 },
                    { 38, "Nike Air Max 90 Beyaz", "Spor Ayakkabı", 3299m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 2799m, 15, "ayakkabi-canta", "Nike", 4.2999999999999998, true, false, 156 },
                    { 39, "Michael Kors Siyah Çanta", "Çanta", 4999m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 3999m, 20, "ayakkabi-canta", "Michael Kors", 4.5999999999999996, true, true, 89 },
                    { 40, "Crocs Terlik Siyah", "Terlik", 499m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 399m, 20, "ayakkabi-canta", "Crocs", 4.2000000000000002, true, false, 234 },
                    { 41, "iPhone 15 Pro Max 256GB", "Telefon", 59999m, "/IMG/urun/apple-iphone-15-pro-max_1-removebg-preview.png", 54999m, 8, "elektronik", "Apple", 4.5, true, true, 128 },
                    { 42, "Samsung Galaxy S24 Ultra 512GB", "Telefon", 52999m, "/IMG/urun/Samsung-Galaxy-S24-Ultra.png", 0m, 0, "elektronik", "Samsung", 4.5999999999999996, true, true, 95 },
                    { 43, "Apple MacBook Pro M3 Max 16\"", "Bilgisayar", 89999m, "/IMG/urun/Apple-MacBook-Pro-M3_1__1_-removebg-preview.png", 0m, 0, "elektronik", "Apple", 4.7000000000000002, false, true, 67 },
                    { 44, "Dell XPS 15 OLED i9 32GB", "Bilgisayar", 45999m, "/IMG/urun/Dell-XPS-15_1-removebg-preview.png", 42999m, 7, "elektronik", "Dell", 4.4000000000000004, true, true, 45 },
                    { 45, "Samsung Galaxy Tab S9 FE", "Tablet", 15999m, "/IMG/urun/Galaxy-Tab-S9-FE_1__1-removebg-preview.png", 13999m, 13, "elektronik", "Samsung", 4.2999999999999998, true, true, 89 },
                    { 46, "Sony WH-1000XM5 Gürültü Önleyici", "Kulaklık", 8499m, "/IMG/urun/Sony-WH-1000XM5_1-removebg-preview.png", 7499m, 12, "elektronik", "Sony", 4.7999999999999998, true, true, 256 },
                    { 47, "Apple AirPods Pro 2. Nesil", "Kulaklık", 7999m, "/IMG/urun/Apple-AirPods-Pro-2-_1_-removebg-preview.png", 7299m, 9, "elektronik", "Apple", 4.5999999999999996, true, false, 312 },
                    { 48, "Sony PlayStation 5 Pro 2TB", "Oyun", 29999m, "/IMG/urun/PlayStation-5-Pro_1-removebg-preview.png", 0m, 0, "elektronik", "Sony", 4.9000000000000004, false, true, 423 },
                    { 49, "Samsung 75\" Neo QLED 8K TV", "Telefon", 149999m, "/IMG/urun/Samsung-75-_1_-removebg-preview.png", 129999m, 13, "elektronik", "Samsung", 4.7000000000000002, true, true, 67 },
                    { 50, "Bose QuietComfort Ultra Kulaklık", "Kulaklık", 9499m, "/IMG/urun/Bose-QuietComfort-Ultra_1-removebg-preview.png", 8499m, 11, "elektronik", "Bose", 4.5, true, true, 134 },
                    { 51, "Casio G-Shock Dijital Kol Saati", "Kol Saati", 1499m, "/IMG/urun/Polo_1-removebg-preview.png", 1199m, 20, "saat-aksesuar", "Casio", 4.4000000000000004, true, false, 234 },
                    { 52, "Swiss Canon Altın Kolye", "Takı", 2999m, "/IMG/urun/Polo_1-removebg-preview.png", 0m, 0, "saat-aksesuar", "Swiss Canon", 4.5999999999999996, true, true, 78 },
                    { 53, "Polaroid Güneş Gözlüğü", "Gözlük", 699m, "/IMG/urun/Polo_1-removebg-preview.png", 499m, 29, "saat-aksesuar", "Polaroid", 4.2000000000000002, true, false, 145 },
                    { 54, "Hugo Boss Siyah Kemer", "Kemer", 899m, "/IMG/urun/Polo_1-removebg-preview.png", 749m, 17, "saat-aksesuar", "Hugo Boss", 4.2999999999999998, true, false, 67 },
                    { 55, "Pierre Cardin Erkek Cüzdan", "Cüzdan", 399m, "/IMG/urun/Polo_1-removebg-preview.png", 299m, 25, "saat-aksesuar", "Pierre Cardin", 4.0999999999999996, true, false, 156 },
                    { 56, "Adidas Originals Erkek Eşofman", "Spor Giyim", 1299m, "/IMG/urun/Diesel-Spor-Ayakkab-_1_-removebg-preview.png", 0m, 0, "spor-outdoor", "Adidas", 4.2999999999999998, true, false, 67 },
                    { 57, "Under Armour Spor Tayt Siyah", "Spor Giyim", 899m, "/IMG/urun/Diesel-Spor-Ayakkab-_1_-removebg-preview.png", 599m, 33, "spor-outdoor", "Under Armour", 4.2999999999999998, true, false, 78 },
                    { 58, "Nike Yoga Mat 6mm", "Fitness", 599m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 0m, 0, "spor-outdoor", "Nike", 4.4000000000000004, true, false, 234 },
                    { 59, "The North Face Sırt Çantası 50L", "Kamp", 2999m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 2499m, 17, "spor-outdoor", "The North Face", 4.7000000000000002, true, true, 145 },
                    { 60, "Salomon Su Geçirmez Mont", "Kamp", 3999m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 2999m, 25, "spor-outdoor", "Salomon", 4.5999999999999996, true, true, 56 },
                    { 61, "Bisiklet Kaskı MIPS Korumalı", "Bisiklet", 899m, "/IMG/urun/Lacoste-Sneaker_1__1_-removebg-preview.png", 749m, 17, "spor-outdoor", "Salcano", 4.5, true, false, 89 }
                });

            migrationBuilder.CreateIndex(
                name: "IX_SiparisDetaylari_SiparisId",
                table: "SiparisDetaylari",
                column: "SiparisId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Kategoriler");

            migrationBuilder.DropTable(
                name: "Kullanicilar");

            migrationBuilder.DropTable(
                name: "SiparisDetaylari");

            migrationBuilder.DropTable(
                name: "Urunler");

            migrationBuilder.DropTable(
                name: "Siparisler");
        }
    }
}
