export const computeNextPage = (currentPage: number, targetedPage: number, pageStates: string[]) => {
    let nextPage = '';
    let computedPageStates = [];
    const pageStatesCopy = [...pageStates];
    if (targetedPage > currentPage) {
        nextPage = pageStatesCopy[pageStatesCopy.length - 1] || ''
    } else {
        // pop top two pages
        pageStatesCopy.pop();
        pageStatesCopy.pop();
        nextPage = pageStatesCopy[pageStatesCopy.length - 1] || '';
    }
    computedPageStates = [...pageStatesCopy];
    return { nextPage, computedPageStates }
}
