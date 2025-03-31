const Action = {
    CHECK_BLOCKLISTED: 'CHECK_BLOCKLISTED'
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
            const companyName = cardAnchor.dataset['companyName'];

            console.log(companyId);
            console.log(companyName);
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
