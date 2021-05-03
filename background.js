
var links = String("");
chrome.tabs.onActivated.addListener(tab =>{
  chrome.tabs.get(tab.tabId, current_tab_info =>{
    
    chrome.storage.sync.set({links:current_tab_info.url}, function StoreLinks() {
      
    });

    chrome.storage.sync.get(['links'], function(result){
      console.log(result.links);
    });
});

})
