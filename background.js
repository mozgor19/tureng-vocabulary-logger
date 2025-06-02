// background.js

// background.js içinde fetchEnglishDefinition fonksiyonu
async function fetchEnglishDefinition(word) {
  const lang = "en";
  const word_id = word.toLowerCase();
  const url = `https://api.dictionaryapi.dev/api/v2/entries/${lang}/${word_id}`;

  console.log("Tureng Logger (Background): Fetching definition for:", word_id, "from URL:", url);

  try {
    const response = await fetch(url, { method: 'GET' });

    if (!response.ok) {
      let errorText = "Tanım bulunamadı veya API hatası.";
      if (response.status === 404) {
        errorText = `Kelime (${word_id}) için tanım bulunamadı.`;
      }
      return { definition: errorText };
    }

    const data = await response.json();
    let allDefinitions = [];

    if (data && data.length > 0) {
      // Kelimenin ilk kaydı (genellikle tek olur)
      const entry = data[0]; 
      if (entry.meanings && entry.meanings.length > 0) {
        entry.meanings.forEach(meaning => {
          if (meaning.definitions && meaning.definitions.length > 0) {
            let defText = meaning.definitions[0].definition;
            if (meaning.partOfSpeech) { // Varsa kelime türünü ekle
                defText = `(${meaning.partOfSpeech}) ${defText}`;
            }
            allDefinitions.push(defText);
          }
        });
      }
    }

    if (allDefinitions.length > 0) {
      const combinedDefinition = allDefinitions.slice(0, 3).join("\n\n---\n\n"); 
      console.log(`Tureng Logger (Background): Combined definition for ${word_id}:`, combinedDefinition);
      return { definition: combinedDefinition };
    } else {
      console.log(`Tureng Logger (Background): Definition data for ${word_id} was empty or in unexpected format:`, data);
      return { definition: "Tanım verisi boş veya beklenmedik formatta." };
    }
  } catch (error) {
    console.error('Tureng Logger (Background): Error fetching from DictionaryAPI:', error);
    return { definition: "Tanım API'sine ulaşılamadı." };
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "LOG_WORD") {
    const wordData = message.data; // { englishWord, turkishMeaning, isPrimary, exampleSentence }
    
    // Asenkron işlemi doğru yönetmek için (async IIFE - Immediately Invoked Function Expression)
    (async () => {
      // API'den tanımı çek
      const definitionResult = await fetchEnglishDefinition(wordData.englishWord);
      const englishDefinition = definitionResult.definition;

      chrome.storage.local.get({ vocabulary: [] }, (result) => {
        let vocabulary = result.vocabulary;
        
        const newEnglishWordLower = wordData.englishWord.toLowerCase();
        const newTurkishMeaningLower = wordData.turkishMeaning.toLowerCase();

        const existingEntryIndex = vocabulary.findIndex(
          entry => entry.englishWord.toLowerCase() === newEnglishWordLower &&
                   entry.turkishMeaning.toLowerCase() === newTurkishMeaningLower
        );

        if (existingEntryIndex > -1) {
          vocabulary[existingEntryIndex].repetitionCount += 1;
          // Eğer tanım daha önce boşsa ve şimdi geldiyse, güncelle
          if (englishDefinition && !vocabulary[existingEntryIndex].englishDefinition) {
            vocabulary[existingEntryIndex].englishDefinition = englishDefinition;
          }
          // Örnek cümle Tureng'den geliyor, eğer daha önce yoksa ve şimdi varsa güncelle
          if (wordData.exampleSentence && !vocabulary[existingEntryIndex].exampleSentence) {
              vocabulary[existingEntryIndex].exampleSentence = wordData.exampleSentence;
          }
          console.log("Kelime güncellendi (tekrar sayısı/eksik bilgi):", vocabulary[existingEntryIndex]);
        } else {
          const newEntry = {
            englishWord: wordData.englishWord,
            turkishMeaning: wordData.turkishMeaning,
            englishDefinition: englishDefinition, // Yeni API'den gelen tanım
            exampleSentence: wordData.exampleSentence || "", // Tureng'den gelen örnek cümle
            repetitionCount: 1,
            addedDate: new Date().toISOString()
          };
          vocabulary.push(newEntry);
          console.log("Yeni kelime/anlam eklendi:", newEntry);
        }
        
        vocabulary.sort((a, b) => new Date(b.addedDate) - new Date(a.addedDate));

        chrome.storage.local.set({ vocabulary: vocabulary }, () => {
          console.log("Kelime listesi kaydedildi.");
          chrome.runtime.sendMessage({ type: "VOCABULARY_UPDATED" });
        });
      });
    })(); // async IIFE'yi hemen çağır

    return true; // Mesaj portunu açık tutmak için (asenkron işlem nedeniyle)
  }
});

chrome.runtime.onInstalled.addListener(() => {
  console.log('Tureng Vocabulary Logger eklentisi kuruldu/güncellendi.');
  chrome.storage.local.get('vocabulary', (result) => {
    if (!result.vocabulary) {
      chrome.storage.local.set({ vocabulary: [] });
    }
  });
});

console.log("Background service worker v3 (DictionaryAPI) started.");