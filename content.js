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
    case 'clear-items-4': {
      const result = await clearItems(4)
      return Promise.resolve({ status: result });
    }
    case 'clear-items-8': {
      const result = await clearItems(8)
      return Promise.resolve({ status: result });
    }
    case 'super-clear-items': {
      let urls = getClearItemsIds()
      const result = await superClear(urls)
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

async function clearItems(itemLength) {
  const clearView = document.querySelectorAll('.rmv.right.btn') || []
  let numToClear = itemLength || clearView.length
  for (let i = 0; i < numToClear; i++) {
    if (clearView && clearView[i]) clearView[i].click()
    await wait(40);
  }
  return true
}

function wait(ms) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(ms)
    }, ms)
  })
}

function getClearItemsIds(itemLength) {
  const superCVD = document.querySelectorAll('.hero.item') || []
  const result = []
  let numToClear = itemLength || superCVD.length
  for (let i = 0; i < numToClear; i++) {
    const sprCvd = superCVD[i].querySelector('button.icn.placeholder')
    const brkArray = sprCvd.getAttribute('href').split('/')
    result.push({ overlay: superCVD[i].querySelector('.overlay'), id: brkArray[brkArray.length - 1] })
  }
  return result
}

async function superClear(arrayIds = []) {
  const mapRequest = []
  for (let i = 0; i < arrayIds.length; i++) {
    mapRequest.push(sendRequest(arrayIds[i]))
  }
  await Promise.all(mapRequest)
  return true
}

function sendRequest(objectArray) {
  const initObject = {
    method: 'GET',
  };
  return new Promise((resolve, reject) => {
    fetch(`https://www.ebay.com/_feedhome/feeds/block/${objectArray.id}?_=${Date.now()}`, initObject)
      .then((response) => response.json())
      .then(function (data) {
        objectArray.overlay.style.display = "block"
        resolve(true)
      })
      .catch(function (err) {
        reject(true)
      });
  })
}