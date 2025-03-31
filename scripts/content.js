const Action = {
    CHECK_BLOCKLISTED: 'CHECK_BLOCKLISTED',
    NEW_BLACKLISTED_COMPANY: 'NEW_BLACKLISTED_COMPANY'
};

(async () => {

    const jobPostersContainer = document.querySelector('[data-cy="job-list"]')
    const jobPostersContainerObserver = new MutationObserver(async (mutations) => {

        const allAddedJobPosters = mutations.filter(mutation => mutation.addedNodes.length > 0)
            .reduce((acc, mutation) => acc.concat(Array.from(mutation.addedNodes)), [])
            .filter(addedNode => addedNode.className.includes('Card_Card'));

        await Promise.allSettled(

            allAddedJobPosters.map(async jobPoster => {
                const jobCard = jobPoster.querySelector('[data-cy="job-card"]');
                const cardAnchor = jobCard.querySelector('a');

                const companyId = cardAnchor.dataset['companyId'];
                const companyName = cardAnchor.dataset['companyName'];
                const jobTitle = cardAnchor.dataset['positionName'];

                const isBlacklistedCompany = await isBlacklisted(companyId);

                if (isBlacklistedCompany) {
                    removeBlackCompanyCard(jobCard);
                } else {
                    const blockListAddDiv = _createBlacklistAddButton(
                        companyId,
                        companyName,
                        jobTitle
                    );
                    cardAnchor.appendChild(blockListAddDiv);
                }
            })
        )
    });

    jobPostersContainerObserver.observe(jobPostersContainer, {
        childList: true,
        subtree: true,
        attributes: false,
        characterData: false
    });
})();

function isBlacklisted(companyId) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({
            action: Action.CHECK_BLOCKLISTED,
            companyId
        }, (response) => {
            const { isBlacklisted: _isBlacklisted } = response;

            resolve(_isBlacklisted)
        });
    });

}

function addToBlacklist(companyId, companyName, jobTitle) {
    return new Promise(resolve => {
        chrome.runtime.sendMessage({
            action: Action.NEW_BLACKLISTED_COMPANY,
            companyId,
            companyName,
            jobTitle
        }, (response) => {
            const { success: __success } = response;

            resolve(__success)
        });
    });
}

function removeBlackCompanyCard(jobCard) {
    const jobCardContainer = jobCard.parentElement;
    const jobList = jobCardContainer.parentElement;

    jobList.removeChild(jobCardContainer);
}

function _createBlacklistAddButton(
    companyId,
    companyName,
    jobTitle
) {

    const divisionContainer = document.createElement('div');
    divisionContainer.style.width = '100%';
    divisionContainer.style.display = 'flex';
    divisionContainer.style.justifyContent = 'center';
    divisionContainer.style.margin = '1rem 0';

    const tagListButtonCSSClasses = document.querySelector('button[aria-labelledby]').classList.value;

    const blocklistAddButton = document.createElement('button');
    blocklistAddButton.type = 'button';
    blocklistAddButton.innerText = '숨기기';
    blocklistAddButton.classList.value = tagListButtonCSSClasses;
    blocklistAddButton.style.width = '100%';

    blocklistAddButton.addEventListener('click', async function (event) {
        event.preventDefault();

        await addToBlacklist(
            companyId,
            companyName,
            jobTitle
        );

        removeAllBlacklistedJobPosters(companyId);
    });

    divisionContainer.appendChild(blocklistAddButton);

    return divisionContainer;
}

function removeAllBlacklistedJobPosters(companyId) {
    const allNewBlacklistedJobPosterAnchors = Array.from(
        document.querySelectorAll(`a[data-company-id="${companyId}"]`)
    );

    allNewBlacklistedJobPosterAnchors.forEach(jobAnchor => {
        const jobCard = jobAnchor.parentElement;

        removeBlackCompanyCard(jobCard);
    });
}