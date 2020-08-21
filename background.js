browser.contextMenus.create({
    id: "ebay-clear-saved-item",
    title: "Clear Saved Search Items",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "ebay-clear-item-4",
    title: "Clear upto 4 Items",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "ebay-clear-item-8",
    title: "Clear upto 8 Items",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "ebay-clear-item-unreload",
    title: "Clear Items Without Reload",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "separator-2",
    type: "separator",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "ebay-super-clear-item",
    title: "Super Clear Items",
    contexts: ["all"]
});
browser.contextMenus.create({
    id: "separator-3",
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
                            removeTab(newtab.id);
                            reloadTab(tab.id);
                        })
                    })
                })
                break;
            }
            case "ebay-clear-saved-item": {
                sendMessage(tab, "clear-items", (res) => {
                    if (res.status) {
                        reloadTab(tab.id)
                    }
                })
                break;
            }
            case "ebay-clear-item-unreload": {
                sendMessage(tab, "clear-items", (res) => { })
                break;
            }
            case "ebay-clear-item-4": {
                sendMessage(tab, "clear-items-4", (res) => {
                    if (res.status) {
                        reloadTab(tab.id)
                    }
                })
                break;
            }
            case "ebay-clear-item-8": {
                sendMessage(tab, "clear-items-8", (res) => {
                    if (res.status) {
                        reloadTab(tab.id)
                    }
                })
                break;
            }
            case "ebay-super-clear-item": {
                sendMessage(tab, "super-clear-items", (res) => {
                    if (res.status) {
                        setTimeout(() => reloadTab(tab.id), 3000)
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

