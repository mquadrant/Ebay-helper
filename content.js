// content-script.js

function handleMessage(request, sender, sendResponse) {
  switch (request.type) {
    case 'clear-feed': {
      sendResponse({ url: clearSavedSearches() })
      break;
    }
    case 'delete-follows': {
      sendResponse({ status: deleteFollows() })
      break;
    }
    case 'clear-items': {
      sendResponse({ status: clearItems() })
      break;
    }
    default: { }
  }
}

browser.runtime.onMessage.addListener(handleMessage);

function clearSavedSearches() {
  const select = document.querySelector('#followInterests > div > div > div.follow-block.interests > a')
  const savedPage = select.getAttribute("href")
  return savedPage
}

function deleteFollows() {
  const selectFollow = document.querySelectorAll('.fol-followed')
  selectFollow.forEach((follow) => follow.click())
  return true
}

function clearItems() {
  const clearView = document.querySelectorAll('.rmv.right.btn') || []
  clearView.forEach((item) => item.click())
  return true
}