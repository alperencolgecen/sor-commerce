using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace backend.Migrations
{
    /// <inheritdoc />
    public partial class AddUrunYeniAlanlar : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Aciklama",
                table: "Urunler",
                type: "nvarchar(2000)",
                maxLength: 2000,
                nullable: true);

            migrationBuilder.AddColumn<decimal>(
                name: "TaksitAylikFiyat",
                table: "Urunler",
                type: "decimal(18,2)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "TaksitSayisi",
                table: "Urunler",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "UrunTuru",
                table: "Urunler",
                type: "nvarchar(100)",
                maxLength: 100,
                nullable: true);

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 4,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 5,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 6,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 7,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 8,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 9,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 10,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 11,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 12,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 13,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 14,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 15,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 16,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 17,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 18,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 19,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 20,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 21,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 22,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 23,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 24,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 25,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 26,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 27,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 28,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 29,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 30,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 31,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 32,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 33,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 34,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 35,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 36,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 37,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 38,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 39,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 40,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 41,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 42,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 43,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 44,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 45,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 46,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 47,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 48,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 49,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 50,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 51,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 52,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 53,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 54,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 55,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 56,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 57,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 58,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 59,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 60,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });

            migrationBuilder.UpdateData(
                table: "Urunler",
                keyColumn: "Id",
                keyValue: 61,
                columns: new[] { "Aciklama", "TaksitAylikFiyat", "TaksitSayisi", "UrunTuru" },
                values: new object[] { null, 0m, 0, null });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Aciklama",
                table: "Urunler");

            migrationBuilder.DropColumn(
                name: "TaksitAylikFiyat",
                table: "Urunler");

            migrationBuilder.DropColumn(
                name: "TaksitSayisi",
                table: "Urunler");

            migrationBuilder.DropColumn(
                name: "UrunTuru",
                table: "Urunler");
        }
    }
}
