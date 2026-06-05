import Breadcrumb from '../../components/Breadcrumb/Breadcrumb';
import './IadeKosullari.css';

const sections = [
  {
    title: '1. Cayma Hakkı',
    content: 'Mesafeli satış sözleşmesi kapsamında, tüketici ürünü teslim aldığı tarihten itibaren 14 (on dört) gün içinde herhangi bir gerekçe göstermeksizin ve cezai şart ödemeksizin cayma hakkına sahiptir. Cayma hakkının kullanılması için bu süre içinde tarafımıza bildirim yapılması yeterlidir.'
  },
  {
    title: '2. Cayma Hakkı Kullanım Şartları',
    content: '',
    subSections: [
      { title: '2.1', content: 'Cayma hakkının kullanıldığına dair bildirim, info@sorticaret.com e-posta adresine veya 0850 222 76 76 numaralı telefona yapılabilir.' },
      { title: '2.2', content: 'Ürünlerin iade kabul şartlarına uygun olması gerekmektedir: kullanılmamış, ambalajı açılmamış, hasarsız ve yeniden satılabilir durumda.' },
      { title: '2.3', content: 'Cayma hakkı kapsamında iade edilecek ürünler, fatura ve iade formu ile birlikte gönderilmelidir.' },
      { title: '2.4', content: 'İade edilecek ürünün orijinal kutusu ve ambalajı korunmuş olmalıdır.' },
    ]
  },
  {
    title: '3. Cayma Hakkı Kapsamı Dışındaki Ürünler',
    content: 'Aşağıdaki ürünler cayma hakkı kapsamı dışındadır:',
    list: [
      'Tüketicinin isteği doğrultusunda kişiselleştirilen ürünler',
      'İç giyim, mayo ve bikini gibi hijyenik ürünler (ambalajı açılmışsa)',
      'Elektronik ürünlerde ambalajı açılmış ve kullanılmış ürünler',
      'Hızlı bozulan veya son kullanma tarihi geçebilecek ürünler',
      'Kozmetik ve kişisel bakım ürünleri (ambalajı açılmışsa)',
      'Dijital içerikler ve yazılımlar (ambalajı açılmışsa)',
    ]
  },
  {
    title: '4. İade Süreci',
    content: '',
    subSections: [
      { title: '4.1', content: 'İade talebiniz oluşturulduktan sonra 3 iş günü içinde kargo firması tarafınıza iletilmek üzere yönlendirilir.' },
      { title: '4.2', content: 'Ürün bize ulaştıktan sonra 3-5 iş günü içinde incelenir ve iade onayı verilir.' },
      { title: '4.3', content: 'Onaylanan iadelerde tutar, 3-7 iş günü içinde ödeme yönteminize göre hesabınıza iade edilir.' },
      { title: '4.4', content: 'Kredi kartı ile yapılan ödemelerde iade, bankanıza bağlı olarak 2-3 haftayı bulabilir.' },
    ]
  },
  {
    title: '5. İade Kargo Ücreti',
    content: '',
    subSections: [
      { title: '5.1', content: 'Ayıplı/hasarlı/kusurlu ürün iadelerinde kargo ücreti tarafımıza aittir.' },
      { title: '5.2', content: 'Cayma hakkı kapsamındaki iadelerde kargo ücreti müşteriye aittir.' },
      { title: '5.3', content: 'İade kargo ücreti 29,90 TL olup, kargo bedeli tarafımıza ödenmediği takdirde ürün iade alınmaz.' },
    ]
  },
  {
    title: '6. Değişim',
    content: 'Değişim talepleri iade sürecine tabidir. İade edilen ürün yerine yeni bir sipariş oluşturmanız gerekmektedir. Aynı ürünün farklı beden/renk seçeneği ile değişimi için müşteri hizmetlerimizle iletişime geçebilirsiniz.'
  },
  {
    title: '7. Önemli Uyarılar',
    list: [
      'İade edilecek ürünlerin fatura ve iade formu ile birlikte gönderilmesi zorunludur.',
      'Kullanılmış, yıkanmış, hasar görmüş veya ambalajı zarar görmüş ürünler iade kabul edilmez.',
      'Kampanyalı ürünlerde iade durumunda kampanya koşulları yeniden hesaplanır.',
      'Hediye çeki ile alınan ürünlerde iade tutarı hediye çekine tanımlanır.',
    ]
  },
];

export default function IadeKosullari() {
  return (
    <>
      <Breadcrumb items={[{ label: 'İade Koşulları' }]} />
      <div className="iade-page">
        <div className="about-hero">
          <h1>İade <span>Koşulları</span></h1>
          <p>14 gün içinde ücretsiz iade hakkı</p>
        </div>

        <div className="iade-content">
          {sections.map((section, i) => (
            <div className="iade-section" key={i}>
              <h2>{section.title}</h2>
              {section.content && <p>{section.content}</p>}
              {section.subSections?.map((sub, j) => (
                <div className="iade-sub" key={j}>
                  <strong>{sub.title}</strong>
                  <p>{sub.content}</p>
                </div>
              ))}
              {section.list && (
                <ul className="iade-list">
                  {section.list.map((item, j) => <li key={j}>{item}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="iade-summary">
          <div className="iade-summary-card">
            <i className="fas fa-check-circle" />
            <h3>Kolay İade</h3>
            <p>14 gün içinde cayma hakkı</p>
          </div>
          <div className="iade-summary-card">
            <i className="fas fa-shipping-fast" />
            <h3>Kargo İade</h3>
            <p>Hatalı ürünlerde ücretsiz</p>
          </div>
          <div className="iade-summary-card">
            <i className="fas fa-wallet" />
            <h3>Hızlı Ödeme</h3>
            <p>İade tutarı 3-7 iş gününde</p>
          </div>
        </div>
      </div>
    </>
  );
}
