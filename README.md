# Tureng Vocabulary Logger Chrome Eklentisi

Bu Chrome eklentisi, İngilizce öğrenirken Tureng Sözlük (tureng.com) üzerinde arattığınız İngilizce kelimeleri ve Türkçe karşılıklarını otomatik olarak kaydetmenize yardımcı olur. Kaydedilen kelimeler, İngilizce tanımları ve Tureng'den alınan örnek cümlelerle zenginleştirilir ve istediğiniz zaman Excel (.xlsx) formatında indirilebilir.

## ✨ Temel Özellikler

* Tureng.com'da aratılan İngilizce kelimeleri ve birincil Türkçe anlamlarını otomatik kaydeder.
* Kullanıcının Tureng sonuçlarından istediği diğer Türkçe anlamları da eklemesine olanak tanır.
* Her kelimenin kaç kez aratıldığını (tekrar sayısını) takip eder.
* Kaydedilen İngilizce kelimeler için (DictionaryAPI.dev üzerinden) İngilizce tanımlar ekler.
* Tureng'den kelimeyle ilgili İngilizce örnek cümleleri alır.
* Tüm kaydedilmiş kelimeleri, tanımları ve örnek cümleleri içeren listeyi yeni bir sekmede görüntüler.
* Listeyi düzenli bir Excel (.xlsx) dosyası olarak indirme imkanı sunar.
* Kayıtlı kelime listesini temizleme seçeneği sunar.
* Veriler tarayıcınızda yerel olarak saklanır ve siz silmedikçe kaybolmaz.

## 🚀 Kurulum ve Yükleme (Chrome Tarayıcıya Ekleme)

Bu eklentiyi Google Chrome tarayıcınıza yüklemek için aşağıdaki adımları izleyin:

1.  **Eklenti Dosyalarını İndirin:**
    * Bu GitHub reposundaki tüm dosyaları bilgisayarınıza indirin. Sağ üstteki "Code" butonuna basıp "Download ZIP" seçeneği ile indirebilir, ardından ZIP dosyasını bir klasöre çıkartabilirsiniz.
    * Veya `git clone https://github.com/mozgor19/tureng-vocabulary-logger.git` komutuyla repoyu klonlayın.

2.  **Chrome Eklentiler Sayfasını Açın:**
    * Google Chrome tarayıcınızı açın.
    * Adres çubuğuna `chrome://extensions` yazıp Enter tuşuna basın.

3.  **Geliştirici Modunu Aktif Edin:**
    * Açılan Eklentiler sayfasının sağ üst köşesinde bulunan **"Geliştirici modu"** (Developer mode) anahtarını açık konuma getirin.

4.  **Eklentiyi Yükleyin:**
    * Geliştirici modu aktif olduktan sonra sol üstte beliren **"Paketlenmemiş öğe yükle"** (Load unpacked) butonuna tıklayın.
    * Açılan dosya seçme penceresinde, 1. adımda indirdiğiniz ve ZIP'ten çıkardığınız (veya klonladığınız) eklenti dosyalarının bulunduğu **ana klasörü** seçin (içinde `manifest.json` dosyasının olduğu klasör). Klasörün içine girmeyin, sadece klasörü seçip "Klasör Seç" (Select Folder) butonuna tıklayın.

5.  **Kurulum Tamamlandı!**
    * Eklenti şimdi Chrome Eklentiler sayfanızda listelenmeli ve Chrome araç çubuğunuzda (genellikle sağ üstte yapboz parçası ikonu altında) ikonu görünmelidir.

## 📖 Nasıl Kullanılır?

1.  Eklenti yüklendikten sonra [Tureng.com](https://tureng.com/) adresine gidin.
2.  Çevirisini görmek istediğiniz bir **İngilizce** kelimeyi aratın (örneğin, "sophisticated", "ubiquitous", "fish").
    * Eklenti, arattığınız İngilizce kelimeyi, Tureng'deki birincil Türkçe anlamını ve (eğer varsa) Tureng'deki bir örnek İngilizce cümleyi otomatik olarak kaydedecektir.
    * Ayrıca, kelimenin İngilizce tanımı da (DictionaryAPI.dev üzerinden) alınacaktır.
3.  Tureng sonuç sayfasında, diğer Türkçe anlamların yanında "Bu Anlamı Kaydet" butonu göreceksiniz. Bu butona tıklayarak o spesifik Türkçe anlamı da listenize ekleyebilirsiniz.
4.  Kaydettiğiniz kelimeleri görmek için Chrome araç çubuğundaki Tureng Vocabulary Logger eklenti ikonuna tıklayın. Açılan küçük penceredeki "Kaydedilen Kelimeleri Göster" butonuna tıklayarak kelime listenizi, tanımlarını ve örnek cümlelerini içeren tam sayfa tabloyu yeni bir sekmede açabilirsiniz.
5.  Bu yeni sekmede, kelime listenizi görüntüleyebilir, "Listeyi Excel Olarak İndir" butonuyla `.xlsx` formatında bilgisayarınıza indirebilir veya "Listeyi Temizle" butonuyla tüm kayıtları silebilirsiniz.

---

## 🔮 Gelecek Güncellemeler

Bu eklenti aktif olarak geliştirilmeye devam etmektedir. Zaman içerisinde eklenmesi planlanan özellikler şunlardır:

* **Mobil Versiyon:**
    * Uygulama şu anda yalnızca masaüstünde çalışabilmektedir. Yakında mobil versiyonu da hizmete girecektir. Katkı sunmak isterseniz lütfen pull-request atmaktan çekinmeyin.

* **Gelişmiş Arayüz ve Kullanıcı Deneyimi:**
    * Kelime listesi sayfasında (yeni sekmede açılan) kelimeler içinde **arama yapma ve filtreleme** özelliği.
    * Kelimeleri alfabetik, eklenme tarihine veya tekrar sayısına göre **sıralama** seçenekleri.
    * Ezberlemeyi kolaylaştırmak için **kelime kartları (flashcard) modu**.
    * Kaydedilen kelime listesinin mobil cihazlarda daha iyi görüntülenmesi için **duyarlı tasarım (responsive design)** iyileştirmeleri.

* **Tanım ve Örnek Cümle Zenginleştirmesi:**
    * İngilizce kelimenin Tureng'deki farklı Türkçe anlamlarına karşılık gelebilecek **daha spesifik İngilizce tanımları bulma ve eşleştirme** konusunda iyileştirmeler
    * Eğer Tureng veya mevcut sözlük API'si yeterli örnek cümle sağlamazsa, **LLM (Büyük Dil Modelleri) kullanarak otomatik ve bağlama uygun örnek cümle üretimi** entegrasyonu.
    * Kullanıcının **manuel olarak kendi örnek cümlelerini veya notlarını** ekleyebilmesi.
    * Birden fazla ücretsiz sözlük kaynağından (örneğin Wordnik, Google Dictionary vb. alternatifleri) tanım çekme seçeneği sunma.

* **Veri Yönetimi ve Entegrasyon:**
    * Kelimeleri "öğrenildi", "tekrar et" gibi farklı kategorilere ayırma veya etiketleme.
    * `chrome.storage.sync` kullanarak (limitler dahilinde) kaydedilen kelimelerin farklı Chrome tarayıcıları arasında **senkronize edilmesi** (kullanıcının Chrome'da oturum açmış ve senkronizasyonu etkinleştirmiş olması koşuluyla).
    * Popüler ezberleme uygulamalarıyla (Anki gibi) veri alışverişi için dışa/içe aktarma formatları desteği.

* **Ayarlar ve Özelleştirme:**
    * Hangi bilgilerin (örnek cümle, İngilizce tanım vb.) otomatik olarak çekileceğine dair kullanıcı ayarları.
    * Eklenti arayüzü için tema seçenekleri (koyu mod gibi).

---

**Not:** Bu eklenti kişisel kullanım ve İngilizce öğrenimine yardımcı olmak amacıyla geliştirilmiştir. Tureng.com veya DictionaryAPI.dev sitelerinin API kullanım koşullarına ve hizmet şartlarına uymak kullanıcının sorumluluğundadır.