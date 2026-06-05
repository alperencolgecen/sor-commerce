import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './FAQ.css';

const categories = [
  {
    title: 'Sipariş İşlemleri',
    icon: 'fas fa-shopping-cart',
    items: [
      { q: 'Nasıl sipariş verebilirim?', a: 'Sitemize üye olduktan sonra dilediğiniz ürünü sepete ekleyip güvenli ödeme adımlarını takip ederek siparişinizi tamamlayabilirsiniz. Üye olmadan da misafir olarak sipariş verebilirsiniz.' },
      { q: 'Siparişimi nasıl takip edebilirim?', a: 'Hesabım > Siparişlerim bölümünden tüm siparişlerinizin durumunu anlık olarak takip edebilirsiniz. Ayrıca siparişiniz kargoya verildiğinde SMS ve e-posta ile bilgilendirilirsiniz.' },
      { q: 'Siparişimi iptal edebilir miyim?', a: 'Siparişiniz kargoya verilmeden önce iptal edebilirsiniz. İptal için Hesabım > Siparişlerim bölümünden ilgili siparişin detayına girip iptal talebi oluşturabilirsiniz. Kargoya verilmiş siparişler için kargo teslim alınmadıysa iade süreci başlatılır.' },
      { q: 'Siparişimde değişiklik yapabilir miyim?', a: 'Siparişiniz hazırlanma aşamasındayken değişiklik yapılamamaktadır. Değişiklik için siparişi iptal edip yeniden oluşturmanız gerekmektedir.' },
    ]
  },
  {
    title: 'Ödeme Seçenekleri',
    icon: 'fas fa-credit-card',
    items: [
      { q: 'Hangi ödeme yöntemlerini kullanabilirim?', a: 'Kredi kartı (Visa, Mastercard, Troy), banka kartı, havale/EFT, kapıda ödeme (nakit/kart) ve taksitli ödeme seçeneklerimiz mevcuttur. Tüm işlemler 256-bit SSL sertifikası ile korunmaktadır.' },
      { q: 'Taksit seçeneği var mı?', a: 'Evet, birçok üründe taksit seçeneği sunuyoruz. Ödeme sayfasında taksit sayısını seçebilirsiniz. Taksit seçenekleri ürün bazında değişiklik gösterebilir.' },
      { q: 'Kapıda ödeme nasıl çalışır?', a: 'Siparişiniz kargo ile teslim edilirken nakit veya kart ile ödeme yapabilirsiniz. Kapıda ödeme seçeneği için ek ücret yansıtılmaktadır.' },
      { q: 'Havale ile ödeme yaparsam siparişim ne zaman işleme alınır?', a: 'Havale/EFT ödemeleri, tutarın hesabımıza yansımasını takiben 1 iş günü içinde işleme alınır. Hafta sonu ve resmi tatillerde işleme alınma süresi uzayabilir.' },
    ]
  },
  {
    title: 'Kargo ve Teslimat',
    icon: 'fas fa-truck',
    items: [
      { q: 'Kargo ücreti ne kadar?', a: '250 TL ve üzeri alışverişlerde kargo ücretsizdir. 250 TL altı siparişlerde kargo ücreti 29,90 TL\'dir. Bazı kampanyalı ürünlerde kargo ücretsiz olabilir.' },
      { q: 'Kargonum ne zaman gelir?', a: 'Siparişleriniz 1-3 iş günü içinde kargoya verilir. Teslimat süresi bulunduğunuz konuma göre 1-5 iş günü arasında değişmektedir.' },
      { q: 'Kargo takip numarasını nereden bulabilirim?', a: 'Siparişiniz kargoya verildiğinde e-posta ve SMS ile kargo takip numaranız gönderilir. Ayrıca Hesabım > Siparişlerim bölümünden de takip numarasına ulaşabilirsiniz.' },
      { q: 'Yurt dışına gönderim yapıyor musunuz?', a: 'Şu an için yalnızca Türkiye içi teslimat hizmetimiz bulunmaktadır. Yakın gelecekte yurt dışı gönderim için çalışmalarımız devam etmektedir.' },
    ]
  },
  {
    title: 'İade ve Değişim',
    icon: 'fas fa-exchange-alt',
    items: [
      { q: 'İade nasıl yapılır?', a: 'Teslim aldığınız tarihten itibaren 14 gün içinde iade edebilirsiniz. Hesabım > Siparişlerim bölümünden iade talebi oluşturabilir, kargo firmasına teslim edebilirsiniz.' },
      { q: 'Hangi ürünler iade edilemez?', a: 'Kişisel bakım ürünleri, iç giyim, mayo/bikini, hijyenik ürünler ve ambalajı açılmış yazılım ürünleri iade edilemez. Detaylı bilgi için İade Koşulları sayfamızı ziyaret edebilirsiniz.' },
      { q: 'İade kargo ücretini kim öder?', a: 'Kusurlu/hasarlı ürünlerde iade kargo ücreti tarafımıza aittir. Cayma hakkı kapsamındaki iadelerde kargo ücreti müşteriye aittir.' },
      { q: 'İade ne zaman sonuçlanır?', a: 'Ürün bize ulaştıktan sonra 3-5 iş günü içinde incelenir ve onaylanır. İade tutarı onayı takiben 3-7 iş günü içinde ödeme yönteminize göre hesabınıza yansıtılır.' },
    ]
  },
  {
    title: 'Üyelik ve Hesap',
    icon: 'fas fa-user',
    items: [
      { q: 'Üyelik oluşturmak zorunda mıyım?', a: 'Üye olmadan da misafir olarak alışveriş yapabilirsiniz. Ancak üye olarak sipariş geçmişinizi görüntüleyebilir, favorilerinizi kaydedebilir ve daha hızlı alışveriş yapabilirsiniz.' },
      { q: 'Şifremi unuttum, ne yapmalıyım?', a: 'Giriş sayfasında "Şifremi Unuttum" bağlantısına tıklayarak e-posta adresinize gönderilecek link ile şifrenizi sıfırlayabilirsiniz.' },
      { q: 'Hesap bilgilerimi nasıl güncelleyebilirim?', a: 'Hesabım > Profilim bölümünden ad, soyad, e-posta, telefon ve adres bilgilerinizi güncelleyebilirsiniz.' },
    ]
  },
];

export default function FAQ() {
  return (
    <>
      <Breadcrumb items={[{ label: 'Sıkça Sorulan Sorular' }]} />
      <div className="faq-page">
        <div className="about-hero">
          <h1>Sıkça Sorulan <span>Sorular</span></h1>
          <p>Aklınıza takılan her şeyin cevabı burada</p>
        </div>

        <div className="faq-search">
          <i className="fas fa-search" />
          <input type="text" placeholder="Sorunuzu yazın..." />
        </div>

        <div className="faq-content">
          {categories.map((cat, i) => (
            <div className="faq-category" key={i}>
              <div className="faq-category-header">
                <i className={cat.icon} />
                <h2>{cat.title}</h2>
              </div>
              <div className="faq-list">
                {cat.items.map((item, j) => (
                  <details className="faq-item" key={j}>
                    <summary className="faq-question">
                      {item.q} <i className="fas fa-chevron-down" />
                    </summary>
                    <div className="faq-answer">
                      <p>{item.a}</p>
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="faq-contact">
          <h3>Yine de cevap bulamadınız mı?</h3>
          <p>Müşteri hizmetlerimiz size yardımcı olmaktan mutluluk duyacaktır.</p>
          <div className="faq-contact-buttons">
            <a href="tel:+903544151234" className="faq-contact-btn">
              <i className="fas fa-phone" /> 0354 415 12 34
            </a>
            <a href="mailto:destek@sorticaret.com" className="faq-contact-btn outline">
              <i className="fas fa-envelope" /> E-posta Gönder
            </a>
          </div>
        </div>
      </div>
    </>
  );
}
