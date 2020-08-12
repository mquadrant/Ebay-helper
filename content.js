// content-script.js

async function handleMessage(request, sender, sendResponse) {
  switch (request.type) {
    case 'clear-feed': {
      const result = clearSavedSearches()
      return Promise.resolve({ url: result });
    }
    case 'delete-follows': {
      const result = await deleteFollows()
      return Promise.resolve({ status: result });
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

async function deleteFollows() {
  const selectFollow = document.querySelectorAll('.fol-followed')
  for (let i = 0; i < selectFollow.length; i++) {
    selectFollow[i].click()
    await wait(5);
  }
  return true
}

async function clearItems() {
  const clearView = document.querySelectorAll('.rmv.right.btn') || []
  for (let i = 0; i < clearView.length; i++) {
    clearView[i].click()
    await wait(20);
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