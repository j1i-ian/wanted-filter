const Action = {
    CHECK_BLOCKLISTED: 'CHECK_BLOCKLISTED',
    NEW_BLACKLISTED_COMPANY: 'NEW_BLACKLISTED_COMPANY'
};

(async () => {
    await waitForLoading();

    const jobPostersContainer = document.querySelector('[data-cy="job-list"]')
    const jobPosterList = Array.from(jobPostersContainer.children);

    await Promise.allSettled(
        jobPosterList.map(async jobPoster => {
            const jobCard = jobPoster.querySelector('[data-cy="job-card"]');
            const cardAnchor = jobCard.querySelector('a');

            const companyId = +cardAnchor.dataset['companyId'];

            const isBlacklistedCompany = await isBlacklisted(companyId);

            if (isBlacklistedCompany) {
                removeBlackCompanyCard(jobCard);
            } else {
                const blockListAddDiv = _createBlacklistAddButton();
                cardAnchor.appendChild(blockListAddDiv);
            }
        })
    )
})();

function waitForLoading() {

    return new Promise(resolve => {
        const jobPostersContainer = document.querySelector('[data-cy="job-list"]')
        const jobPostersContainerObserver = new MutationObserver((mutations, observer) => {
            resolve(mutations);
        });

        jobPostersContainerObserver.observe(jobPostersContainer, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
    })
}

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

function removeBlackCompanyCard(jobCard) {
    const jobCardParent = jobCard.parentElement;

    jobCardParent.removeChild(jobCard);
}

function _createBlacklistAddButton() {

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
    });

    divisionContainer.appendChild(blocklistAddButton);

    return divisionContainer;
}