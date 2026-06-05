import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './KVKK.css';

const sections = [
  {
    title: 'Veri Sorumlusu ve Temsilcisi',
    content: '6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, kişisel verileriniz; veri sorumlusu sıfatıyla SOR-Ticaret Teknoloji A.Ş. ("Şirket") tarafından aşağıda açıklanan kapsamda işlenebilecek ve aktarılabilmektedir.'
  },
  {
    title: 'Kişisel Verilerin Hangi Amaçla İşleneceği',
    content: 'Kişisel verileriniz aşağıdaki amaçlar doğrultusunda işlenmektedir:',
    list: [
      'Üyelik kaydı oluşturma ve hesap yönetimi',
      'Siparişlerin alınması, işlenmesi ve teslimatı',
      'Ödeme işlemlerinin gerçekleştirilmesi',
      'Müşteri hizmetleri ve destek taleplerinin yanıtlanması',
      'Kampanya ve promosyonlardan haberdar etme',
      'Hizmet kalitesinin artırılması ve müşteri memnuniyeti',
      'Yasal yükümlülüklerin yerine getirilmesi',
      'İade ve değişim süreçlerinin yönetilmesi',
    ]
  },
  {
    title: 'İşlenen Kişisel Veriler',
    content: 'Aşağıdaki kişisel verileriniz işlenmektedir:',
    list: [
      'Kimlik Bilgileri: Ad, soyad, T.C. kimlik numarası (zorunlu durumlarda)',
      'İletişim Bilgileri: E-posta adresi, telefon numarası, adres bilgileri',
      'Ödeme Bilgileri: Kredi kartı bilgileri (PVK tarafından şifrelenerek saklanır)',
      'İşlem Bilgileri: Sipariş geçmişi, fatura bilgileri, iade kayıtları',
      'Kullanıcı Bilgileri: Şifre, kullanıcı adı, favori ürün listesi, sepet bilgileri',
      'Teknik Bilgiler: IP adresi, tarayıcı bilgileri, çerez verileri, site kullanım istatistikleri',
    ]
  },
  {
    title: 'Kişisel Verilerin Toplanma Yöntemi ve Hukuki Sebebi',
    content: 'Kişisel verileriniz, Şirketimizle paylaştığınız bilgiler kapsamında; internet sitemiz, mobil uygulamalar, çağrı merkezi, sosyal medya hesapları ve diğer iletişim kanalları aracılığıyla aşağıdaki hukuki sebeplere dayanarak toplanmaktadır:',
    list: [
      'Sözleşmenin kurulması ve ifası',
      'Hukuki yükümlülüklerin yerine getirilmesi',
      'Açık rızanızın bulunması',
      'Bir hakkın tesisi, kullanılması veya korunması',
      'İlgili kişinin temel hak ve özgürlüklerine zarar vermemek kaydıyla veri sorumlusunun meşru menfaati',
    ]
  },
  {
    title: 'Kişisel Verilerin Aktarılması',
    content: 'Kişisel verileriniz, aşağıdaki kişi/kurumlara KVKK\'da belirtilen şartlar çerçevesinde aktarılabilir:',
    list: [
      'Kargo şirketleri (teslimat için)',
      'Ödeme kuruluşları ve bankalar (ödeme işlemleri için)',
      'Hukuk danışmanlık firmaları (yasal süreçler için)',
      'Resmi merciler ve kamu kurumları (yasal zorunluluk halinde)',
      'Bulut hizmet sağlayıcıları (veri depolama için)',
    ]
  },
  {
    title: 'KVKK Kapsamında Haklarınız',
    content: 'KVKK\'nın 11. maddesi uyarınca aşağıdaki haklara sahipsiniz:',
    list: [
      'Kişisel verilerinizin işlenip işlenmediğini öğrenme',
      'Kişisel verileriniz işlenmişse buna ilişkin bilgi talep etme',
      'Kişisel verilerinizin işlenme amacını ve amacına uygun kullanılıp kullanılmadığını öğrenme',
      'Yurt içinde veya yurt dışında kişisel verilerinizin aktarıldığı üçüncü kişileri bilme',
      'Kişisel verilerinizin eksik veya yanlış işlenmiş olması halinde bunların düzeltilmesini isteme',
      'KVKK\'nın 7. maddesinde öngörülen şartlar çerçevesinde kişisel verilerinizin silinmesini veya yok edilmesini isteme',
      'Düzeltme, silme veya yok etme işlemlerinin, verilerin aktarıldığı üçüncü kişilere bildirilmesini isteme',
      'İşlenen verilerin münhasıran otomatik sistemler ile analizi suretiyle aleyhinize bir sonucun ortaya çıkmasına itiraz etme',
      'Kişisel verilerinizin kanuna aykırı olarak işlenmesi sebebiyle zarara uğramanız halinde zararın giderilmesini talep etme',
    ]
  },
  {
    title: 'Haklarınızı Kullanma Yöntemi',
    content: 'Yukarıda belirtilen haklarınızı kullanmak için KVKK\'nın 11. maddesi uyarınca başvurunuzu, Veri Sorumlusuna yazılı olarak veya Kişisel Verileri Koruma Kurulu\'nun belirlediği diğer yöntemlerle iletebilirsiniz. Başvurularınız en kısa sürede ve en geç 30 (otuz) gün içinde ücretsiz olarak sonuçlandırılacaktır.'
  },
  {
    title: 'Çerez Politikası',
    content: 'Web sitemiz, kullanıcı deneyimini iyileştirmek ve site trafiğini analiz etmek amacıyla çerezler kullanmaktadır. Çerez tercihlerinizi tarayıcı ayarlarından yönetebilirsiniz. Detaylı bilgi için Çerez Politikamızı inceleyebilirsiniz.'
  },
  {
    title: 'Veri Güvenliği',
    content: 'Kişisel verilerinizin güvenliğini sağlamak amacıyla gerekli teknik ve idari tedbirler alınmaktadır. Verileriniz 256-bit SSL sertifikası ile şifrelenmekte, yetkisiz erişime karşı korunmaktadır.'
  },
];

export default function KVKK() {
  return (
    <>
      <Breadcrumb items={[{ label: 'KVKK Aydınlatma Metni' }]} />
      <div className="kvkk-page">
        <div className="about-hero">
          <h1>KVKK <span>Aydınlatma Metni</span></h1>
          <p>Kişisel verilerinizin güvenliği bizim için önemli</p>
        </div>

        <div className="kvkk-info">
          <i className="fas fa-info-circle" />
          <p>6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında, siz değerli müşterilerimizi bilgilendirmek amacıyla hazırlanmıştır.</p>
        </div>

        <div className="kvkk-content">
          {sections.map((section, i) => (
            <div className="kvkk-section" key={i}>
              <h2>{section.title}</h2>
              {section.content && <p>{section.content}</p>}
              {section.list && (
                <ul className="kvkk-list">
                  {section.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="kvkk-footer">
          <div className="kvkk-footer-card">
            <i className="fas fa-calendar-alt" />
            <div>
              <h4>Son Güncelleme</h4>
              <p>01 Ocak 2025</p>
            </div>
          </div>
          <div className="kvkk-footer-card">
            <i className="fas fa-building" />
            <div>
              <h4>Veri Sorumlusu</h4>
              <p>SOR-Ticaret Teknoloji A.Ş.</p>
            </div>
          </div>
          <div className="kvkk-footer-card">
            <i className="fas fa-envelope" />
            <div>
              <h4>Başvuru E-posta</h4>
              <p>kvkk@sorticaret.com</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
