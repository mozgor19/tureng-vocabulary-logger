document.addEventListener('DOMContentLoaded', () => {
  const vocabularyTableBody = document.getElementById('vocabularyTable').querySelector('tbody');
  const downloadCsvButton = document.getElementById('downloadCsv');
  const clearListButton = document.getElementById('clearList');

  function renderVocabulary(vocabulary) {
    vocabularyTableBody.innerHTML = ''; // Tabloyu temizle

    // Tarihe göre en yeniden eskiye sırala (opsiyonel)
    vocabulary.sort((a, b) => new Date(b.addedDate || 0) - new Date(a.addedDate || 0));


    if (vocabulary.length === 0) {
      const row = vocabularyTableBody.insertRow();
      const cell = row.insertCell();
      cell.colSpan = 7;
      cell.textContent = 'Henüz kaydedilmiş kelime yok.';
      cell.style.textAlign = 'center';
      return;
    }

    vocabulary.forEach((item, index) => {
      const row = vocabularyTableBody.insertRow();
      row.insertCell().textContent = item.englishWord;
      row.insertCell().textContent = item.turkishMeaning;
      
      const defCell = row.insertCell();
      defCell.textContent = item.englishDefinition;
      defCell.title = item.englishDefinition; // Tam tanım için tooltip
      defCell.classList.add('tooltip-cell');


      const exCell = row.insertCell();
      exCell.textContent = item.exampleSentence;
      exCell.title = item.exampleSentence; // Tam cümle için tooltip
      exCell.classList.add('tooltip-cell');

      row.insertCell().textContent = item.repetitionCount;
      row.insertCell().textContent = item.addedDate ? new Date(item.addedDate).toLocaleDateString() : '-';
      
      const deleteCell = row.insertCell();
      const deleteButton = document.createElement('button');
      deleteButton.textContent = 'X';
      deleteButton.title = 'Bu kelimeyi sil';
      deleteButton.classList.add('delete-btn');
      deleteButton.addEventListener('click', () => {
        deleteWord(index, vocabulary);
      });
      deleteCell.appendChild(deleteButton);
    });
  }

  function loadVocabulary() {
    chrome.storage.local.get({ vocabulary: [] }, (result) => {
      renderVocabulary(result.vocabulary);
    });
  }
  
  function deleteWord(indexToDelete, currentVocabulary) {
    if (confirm(`'${currentVocabulary[indexToDelete].englishWord} - ${currentVocabulary[indexToDelete].turkishMeaning}' kelimesini silmek istediğinize emin misiniz?`)) {
      currentVocabulary.splice(indexToDelete, 1);
      chrome.storage.local.set({ vocabulary: currentVocabulary }, () => {
        loadVocabulary(); // Listeyi yeniden yükle
        console.log("Kelime silindi ve liste güncellendi.");
      });
    }
  }

  downloadCsvButton.addEventListener('click', () => {
    chrome.storage.local.get({ vocabulary: [] }, (result) => {
      const vocabulary = result.vocabulary;
      if (vocabulary.length === 0) {
        alert("İndirilecek kelime yok.");
        return;
      }

      // Excel için veri hazırlama
      const dataForExcel = vocabulary.map(item => {
        let formattedDate = '';
        if (item.addedDate) {
          try {
            const dateObj = new Date(item.addedDate);
            const year = dateObj.getFullYear();
            const month = ('0' + (dateObj.getMonth() + 1)).slice(-2);
            const day = ('0' + dateObj.getDate()).slice(-2);
            const hours = ('0' + dateObj.getHours()).slice(-2);
            const minutes = ('0' + dateObj.getMinutes()).slice(-2);
            formattedDate = `${year}-${month}-${day} ${hours}:${minutes}`;
          } catch (e) { /* Hata olursa boş bırak */ }
        }

        return {
          "İngilizce Kelime": item.englishWord || "",
          "Türkçe Anlamı": item.turkishMeaning || "",
          "İngilizce Tanımı": item.englishDefinition || "",
          "Örnek Cümle": item.exampleSentence || "",
          "Tekrar Sayısı": item.repetitionCount || 0,
          "Eklendiği Tarih": formattedDate
        };
      });

      // Çalışma sayfası (worksheet) oluştur
      const worksheet = XLSX.utils.json_to_sheet(dataForExcel);

      // Sütun genişliklerini ayarla (isteğe bağlı ama daha iyi görünüm için)
      const columnWidths = [
        { wch: 25 }, // İngilizce Kelime
        { wch: 30 }, // Türkçe Anlamı
        { wch: 50 }, // İngilizce Tanımı
        { wch: 60 }, // Örnek Cümle
        { wch: 12 }, // Tekrar Sayısı
        { wch: 20 }  // Eklendiği Tarih
      ];
      worksheet['!cols'] = columnWidths;

      // Çalışma kitabı (workbook) oluştur
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Kelimeler"); // Sayfa adı "Kelimeler"

      // Excel dosyasını oluştur ve indirmeyi tetikle
      // XLSX.write(workbook, { bookType: 'xlsx', type: 'array' }); // Bu satır binary data verir
      // Aşağıdaki satır direkt dosyayı indirir:
      XLSX.writeFile(workbook, "tureng_kelimelerim.xlsx"); 

      console.log("Excel dosyası oluşturuluyor ve indirme başlatıldı.");
    });
  });

  clearListButton.addEventListener('click', () => {
    if (confirm("Tüm kelime listenizi silmek istediğinize emin misiniz? Bu işlem geri alınamaz!")) {
      chrome.storage.local.set({ vocabulary: [] }, () => {
        loadVocabulary(); // Listeyi boş olarak yeniden yükle
        alert("Kelime listesi temizlendi.");
      });
    }
  });

  // Kelime listesini ilk açılışta yükle
  loadVocabulary();

  // Arka plandan güncelleme mesajı gelirse listeyi yenile (opsiyonel)
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.type === "VOCABULARY_UPDATED") {
      loadVocabulary();
    }
  });
});