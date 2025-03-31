const INDEXED_DB_VERSION = 1;
const APP_DATABASE_NAME = 'wantedFilterDatabase'
const BLACKLIST_COMPANY_STORE_KEY = 'blacklistCompanyStore'

const Action = {
    CHECK_BLOCKLISTED: 'CHECK_BLOCKLISTED'
};

const Vendor = {
    WANTED: 'wanted'
};

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {

    (async () => {

        const { companyId } = request;

        switch (request.action) {
            case Action.CHECK_BLOCKLISTED:
                const isBlacklisted = await isBlackListedCompany(companyId);

                sendResponse({ isBlacklisted });
                break;
            default:
                console.error('Unknown action');

                throw new Error('Unknown Action is detected');
        }
    })();

    // Prevent exit function on async
    return true;
});


async function isBlackListedCompany(companyId) {

    const result = await new Promise(resolve => {

        const request = indexedDB.open(APP_DATABASE_NAME, INDEXED_DB_VERSION);

        request.onupgradeneeded = function (_event) {
            const _db = _event.target.result;

            const _isInitialized = _db.objectStoreNames.contains(
                BLACKLIST_COMPANY_STORE_KEY
            );
            const _notInitialized = !_isInitialized;

            if (_notInitialized) {
                _db.createObjectStore(
                    BLACKLIST_COMPANY_STORE_KEY,
                    {
                        keyPath: 'id',
                        autoIncrement: true
                    }
                );
            }

            return _db;
        }

        request.onsuccess = async function (_event) {

            const _db = _event.target.result;

            const _transaction = _db.transaction(
                BLACKLIST_COMPANY_STORE_KEY,
                'readonly'
            );

            const _store = _transaction.objectStore(
                BLACKLIST_COMPANY_STORE_KEY
            );

            const _getRequest = _store.get(companyId);

            _getRequest.onsuccess = function () {
                const __data = _getRequest.result;
                const __result = !!__data;

                resolve(__result);
            };

            _getRequest.onerror = function () {
                console.log('Data Access Error');
            };

        }

        request.onerror = function (_event) {
            console.log('IndexedDB open is failed:', _event.target.error);
        };
    });

    return result;
}