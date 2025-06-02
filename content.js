// Tureng sayfasında çalışacak kod
console.log("Tureng Logger: DETAILED content.js v7 (Nihai Düzeltme) loaded.");

function getSearchedEnglishWordFromURL() { 
  const currentPathname = window.location.pathname;
  console.log("Tureng Logger: getSearchedEnglishWordFromURL çağrıldı. Pathname:", currentPathname);
  const pathParts = currentPathname.split('/');

  if (pathParts.length > 3 && 
      (pathParts[2] === 'turkish-english' || pathParts[2] === 'turkce-ingilizce')) {
    const potentialWord = pathParts[3];
    if (potentialWord && /^[a-zA-Z0-9\s'-]+$/.test(potentialWord)) { // Sadece İngilizce karakterler + rakam, boşluk, tire, kesme
      const decodedWord = decodeURIComponent(potentialWord).toLowerCase();
      console.log("Tureng Logger: Aranan İngilizce Kelime (URL'den):", decodedWord);
      return decodedWord;
    } else {
      console.log("Tureng Logger: URL'deki potansiyel kelime geçerli değil veya boş:", potentialWord);
    }
  }
  console.log("Tureng Logger: URL yapısı kelime çıkarmak için uygun değil.");
  return null;
}

function extractExampleSentence(meaningRow) {
    let nextRow = meaningRow.nextElementSibling;
    if (nextRow && nextRow.classList.contains('example-sentences-row')) {
        const exampleCell = nextRow.querySelector('td.example-sentences');
        if (exampleCell) {
            const innerHTMLContent = exampleCell.innerHTML;
            const firstBrIndex = innerHTMLContent.toLowerCase().indexOf('<br>');
            let englishSentenceHTML = innerHTMLContent;
            if (firstBrIndex !== -1) {
                englishSentenceHTML = innerHTMLContent.substring(0, firstBrIndex);
            }
            let tempDiv = document.createElement('div');
            tempDiv.innerHTML = englishSentenceHTML;
            let sentence = (tempDiv.textContent || tempDiv.innerText || "").trim();
            if (sentence) console.log("Tureng Logger: Örnek cümle bulundu:", sentence);
            return sentence;
        }
    }
    return "";
}

function extractMeanings() {
  console.log("Tureng Logger: extractMeanings çağrıldı.");
  const searchedEnglishWordFromURL = getSearchedEnglishWordFromURL();
  if (!searchedEnglishWordFromURL) return;

  const targetTable = document.getElementById('englishResultsTable');
  if (!targetTable || !targetTable.querySelector('tbody')) {
    console.log("Tureng Logger: 'englishResultsTable' veya tbody'si bulunamadı.");
    return;
  }

  const rows = targetTable.querySelectorAll('tbody tr');
  console.log(`Tureng Logger: Tabloda ${rows.length} satır bulundu.`);
  let firstMeaningAdded = false;
  let meaningsFoundCount = 0;

  rows.forEach((row, rowIndex) => {
    if (row.classList.contains('mobile-category-row') ||
        row.classList.contains('example-sentences-row') ||
        row.style.display === 'none' ||
        (row.cells[0] && row.cells[0].tagName === 'TH') ||
        row.cells.length < 4 ) { // En az 4 hücre olmalı (0,1,2,3)
      return;
    }

    const cellContainingEnglishSourceTerm = row.cells[2]; 
    const cellContainingTurkishTranslation = row.cells[3];

    if (!cellContainingEnglishSourceTerm || !cellContainingTurkishTranslation) return;
    
    // console.log(`Tureng Logger: Satır ${rowIndex} -> İng. Kaynak Hücre HTML (cell[2]): ${cellContainingEnglishSourceTerm.innerHTML} || Tr. Çeviri Hücre HTML (cell[3]): ${cellContainingTurkishTranslation.innerHTML}`);

    const linkInEnglishSourceCell = cellContainingEnglishSourceTerm.querySelector('a');
    const linkInTurkishTranslationCell = cellContainingTurkishTranslation.querySelector('a');

    if (linkInEnglishSourceCell && linkInTurkishTranslationCell) {
      const englishTextFromSourceCell = linkInEnglishSourceCell.textContent.trim().toLowerCase();
      const turkishTextFromTranslationCell = linkInTurkishTranslationCell.textContent.trim(); // Türkçe'yi lowerCase yapma

      console.log(`Tureng Logger: Satır ${rowIndex} -> Ayıklanan İng. Kaynak Metin (cell[2]'den): '${englishTextFromSourceCell}', Ayıklanan Tr. Çeviri Metin (cell[3]'ten): '${turkishTextFromTranslationCell}'`);

      if (englishTextFromSourceCell === searchedEnglishWordFromURL) {
        meaningsFoundCount++;
        let exampleSentence = extractExampleSentence(row);
        console.log(`Tureng Logger: === EŞLEŞME BULUNDU === Satır: ${rowIndex}, İng: '${searchedEnglishWordFromURL}', Tr: '${turkishTextFromTranslationCell}', Örnek: '${exampleSentence}'`);

        const dataToSend = {
            englishWord: searchedEnglishWordFromURL, // URL'den gelen anahtar kelime
            turkishMeaning: turkishTextFromTranslationCell,
            exampleSentence: exampleSentence,
            isPrimary: !firstMeaningAdded
        };

        if (!firstMeaningAdded) {
          chrome.runtime.sendMessage({ type: "LOG_WORD", data: dataToSend });
          firstMeaningAdded = true;
        }

        // Buton ekleme (Türkçe anlamın olduğu hücreye - cellContainingTurkishTranslation)
        if (!cellContainingTurkishTranslation.querySelector('.add-meaning-btn')) {
          const addButton = document.createElement('button');
          addButton.textContent = 'Bu Anlamı Kaydet';
          addButton.className = 'add-meaning-btn';
          addButton.style.marginLeft = '5px'; addButton.style.padding = '1px 3px'; addButton.style.fontSize='0.75em';
          addButton.style.border = '1px solid #ccc'; addButton.style.cursor = 'pointer';

          addButton.onclick = (e) => {
            e.stopPropagation();
            const buttonData = { ...dataToSend, isPrimary: false }; // isPrimary: false olacak
            chrome.runtime.sendMessage({ type: "LOG_WORD", data: buttonData });
            addButton.textContent = 'Eklendi!'; addButton.disabled = true;
            setTimeout(() => { addButton.remove(); }, 2000);
          };
          cellContainingTurkishTranslation.appendChild(addButton);
        }
      }
    }
  });

  if (meaningsFoundCount === 0) {
    console.log("Tureng Logger: Tarama bitti. Aranan kelime için işlenecek/eşleşen anlam bulunamadı.");
  } else {
    console.log(`Tureng Logger: Tarama bitti. Toplam ${meaningsFoundCount} anlam işlendi/bulundu.`);
  }
}

let lastUrlExtract = location.href;
const observerCallback = () => {
  const url = location.href;
  if (url !== lastUrlExtract) {
    lastUrlExtract = url;
    console.log("Tureng Logger: URL değişti, extractMeanings 1.2sn sonra tetiklenecek.");
    setTimeout(extractMeanings, 1200); 
  }
};
const observer = new MutationObserver(observerCallback);
observer.observe(document.documentElement, { childList: true, subtree: true }); 

if (document.readyState === 'complete') {
  console.log("Tureng Logger: Sayfa zaten yüklü, extractMeanings 1.8sn sonra tetiklenecek.");
  setTimeout(extractMeanings, 1800); 
} else {
  window.addEventListener('load', () => {
    console.log("Tureng Logger: Sayfa yüklendi (load event), extractMeanings 1.8sn sonra tetiklenecek.");
    setTimeout(extractMeanings, 1800);
  }, { once: true });
}