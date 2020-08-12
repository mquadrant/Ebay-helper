// content-script.js

async function handleMessage(request, sender, sendResponse) {
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
      const result = await clearItems()
      return Promise.resolve({ status: result });
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

async function clearItems() {
  const clearView = document.querySelectorAll('.rmv.right.btn') || []
  for (let i = 0; i < clearView.length; i++) {
    clearView[i].click()
    await wait(50);
  }
  // https://www.ebay.com/_feedhome/feeds/block/203074516993?_=1597215294874
  return true
}

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}