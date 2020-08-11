// function init() {
// create a context menus
browser.contextMenus.create({
    id: "ebay-clear-saved-item",
    title: "Clear Saved Search Items",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "separator-2",
    type: "separator",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "ebay-clear-saved-feed",
    title: "Clear Saved Search Feed",
    contexts: ["all"]
});

// add action listener to context menus
browser.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.pageUrl === "https://www.ebay.com/feed" || true) {
        switch (info.menuItemId) {
            case "ebay-clear-saved-feed": {
                sendMessage(tab, "clear-feed", ({ url }) => {
                    createNewTab(url, (newtab) => {
                        sendMessage(newtab, "delete-follows", (response) => {
                            setTimeout(() => {
                                removeTab(newtab.id);
                                reloadTab(tab.id);
                            }, 1000)
                        })
                    })
                })
                break;
            }
            case "ebay-clear-saved-item": {
                sendMessage(tab, "clear-items", ({ status }) => {
                    if (status) {
                        setTimeout(() => reloadTab(tab.id), 2000)
                    }
                })
                break;
            }
            default: { }
        }
    }

});
// }

function createNewTab(url, callback) {
    browser.tabs.create({ url: url.toString(), active: false })
        .then((tab) => {
            browser.tabs.onUpdated.addListener((tabId, changeInfo, tabInfo) => {
                if (changeInfo && changeInfo.status === 'complete') {
                    callback(tab)
                }
            });
        });
}

function removeTab(tabId) {
    browser.tabs.remove(tabId);
}

function reloadTab(tabId) {
    browser.tabs.reload(tabId);
}

function onError(error) {
    console.error(`Error: ${error}`);
}

function handleMessage(request, sender, sendResponse) {
    switch (request.action) {
        case 'init': {
            init(sendResponse)
            break;
        }
        default: { }
    }
}

function sendMessage(tab, actionType, callback) {
    browser.tabs.sendMessage(
        tab.id,
        { type: actionType }
    ).then(response => {
        callback(response)
    }).catch(onError);
}

browser.runtime.onMessage.addListener(handleMessage);

