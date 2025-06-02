//popup.js (Sadece yeni sekmeyi açar)
document.addEventListener('DOMContentLoaded', () => {
  const openTableViewButton = document.getElementById('openTableView');

  if (openTableViewButton) {
    openTableViewButton.addEventListener('click', () => {
      // table_view.html dosyasını yeni bir sekmede aç
      chrome.tabs.create({ url: chrome.runtime.getURL('table_view.html') });
      window.close(); // Popup'ı kapat
    });
  } else {
    console.error("Button with ID 'openTableView' not found in popup.html");
  }
});