
const APP_DATABASE_NAME = 'wantedFilterDatabase'
const BLACKLIST_COMPANY_STORE_KEY = 'blacklistCompanyStore'

const Action = {
    CHECK_BLOCKLISTED: 'CHECK_BLOCKLISTED'
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    (async () => {

        const { companyId } = request;

        switch (request.action) {
            case Action.CHECK_BLOCKLISTED:
                console.log('companyId is retrieved:', companyId)
                sendResponse({ isBlacklisted: true });
                break;
            default:
                console.error('Unknown action');
                break;
        }
    })();

    // Prevent exit function on async
    return true;
});

