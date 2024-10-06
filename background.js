chrome.tabs.onUpdated.addListener((tabId, tab) => {
  if (tab.url && tab.url.includes("youtube.com/watch")) {
    
    console.log('onUpdated')
    const queryParameters = tab.url.split("?")[1];
    const urlParameters = new URLSearchParams(queryParameters);

      chrome.tabs.sendMessage(tabId, {
        type: "NEW",
        videoId: urlParameters.get("v"),
        value: '444'
      });
    }
  });
  chrome.tabs.onActivated.addListener((activeInfo) => {
    // Get the tab details, including the URL
    chrome.tabs.get(activeInfo.tabId, (tab) => {
      if (tab.url && tab.url.includes("youtube.com/watch")) {
        console.log('activated');
  
        // Inject the content script into the activated tab
        chrome.scripting.executeScript({
          target: { tabId: activeInfo.tabId },
          files: ['contentScript.js']
        }, () => {
          const queryParameters = tab.url.split("?")[1];
          const urlParameters = new URLSearchParams(queryParameters);
  
          // Send the message to the content script after ensuring it is injected
          chrome.tabs.sendMessage(activeInfo.tabId, {
            type: "NEW",
            videoId: urlParameters.get("v"),
            value: '444'
          });
        });
      }
    });
  });
// // Define a function to handle tab activation
// function handleTabActivation(activeInfo) {
//   chrome.tabs.get(activeInfo.tabId, tab => {
//     if (tab.url && tab.url.includes("youtube.com/watch")) {
//       const queryParameters = tab.url.split("?")[1];
//       const urlParameters = new URLSearchParams(queryParameters);

//       chrome.tabs.sendMessage(activeInfo.tabId, {
//         type: "NEW",
//         videoId: urlParameters.get("v"),
//         value: '444'
//       });
//     }
//   });
// }

// // Register the event listener when the background script is initialized
// chrome.runtime.onStartup.addListener(() => {
//   console.log('onStartup')
//   chrome.tabs.onActivated.addListener(handleTabActivation);
// });

// // Register the event listener when the extension is installed or updated
// chrome.runtime.onInstalled.addListener(() => {
//   console.log('onInstalled')
//   chrome.tabs.onActivated.addListener(handleTabActivation);
// });