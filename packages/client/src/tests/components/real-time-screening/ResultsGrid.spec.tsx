import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import {defaultContext} from "src/utils/AppContext";
import ResultsGrid from "src/components/ResultsGrid";
import filtersData from "src/tests/mocks/filtersData";
import moment from "moment";
import { LikliHood } from "src/enums";
import screenedIndividualResults from "src/tests/mocks/screenedIndividualResults";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('realtime screening results', function () {
    let loginButton: any;
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;
    let filtersChanged: jest.Mock<any, any>,
        currentPageChanged: jest.Mock<any, any>,
        setRecordsPerPage: jest.Mock<any, any>,
        sortingChanged: jest.Mock<any, any>
    let screenedResults: any[] = [{}, {}, {}];
    let currentPage: number,
        totalRecordsAvailable: number,
        totalPages: number,
        currentRecordsPerPage: number,
        isScreening: boolean,
        sortBy: string
    let defaultFilters = {
        database: '',
        category: '',
        subCategory: '',
        selectedLikliHood: '',
        updatedDate: ''
    }

    beforeEach(() => {
        jest.useFakeTimers('modern');
        jest.setSystemTime(new Date(2020, 3, 1));
        markAsAuthenticated = jest.fn();
        filtersChanged = jest.fn();
        currentPageChanged = jest.fn();
        setRecordsPerPage = jest.fn();
        sortingChanged = jest.fn();

        screenedResults = screenedIndividualResults;
        currentPage = 1;
        totalRecordsAvailable = 0;
        totalPages = 1;
        isScreening = true;
        sortBy = 'Highest match';
        currentRecordsPerPage = 10;

        renderedApp = renderWithContext(
            <ResultsGrid
                results={screenedResults}
                fetchPage={currentPageChanged}
                currentPage={currentPage}
                currentRecordsPerPage={currentRecordsPerPage}
                setRecordsPerPage={setRecordsPerPage}
                totalRecordsAvailable={totalRecordsAvailable}
                totalPages={totalPages}
                filtersChanged={filtersChanged}
                filtersData={filtersData}
                isScreening={isScreening}
                sortingChanged={sortingChanged}
                sortBy={sortBy}
            />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    describe('Filter Databases:', function () {
        let filter: Element | null;
        beforeEach(() => {
            filter = renderedApp.container.querySelector('select[name="database-filter"]')
        });

        test('should have a databases filter', async () => {
            expect(filter).toBeInTheDocument();
        })

        describe('if databases filter is changed', function () {
            test('should broadcast \'filtersChanged\'', async () => {
                fireEvent.change(filter!, { target: { value: 'two'} })
                expect(filtersChanged).toHaveBeenCalledWith({ ...defaultFilters, database: 'two' })
            })
        });
    });

    describe('Filter Categories:', function () {
        let filter: Element | null;
        beforeEach(() => {
            filter = renderedApp.container.querySelector('select[name="category-filter"]')
        });

        test('should have a category filter', async () => {
            expect(filter).toBeInTheDocument();
        })

        describe('if category filter is changed', function () {
            test('should broadcast \'filtersChanged\'', async () => {
                fireEvent.change(filter!, { target: { value: 'two'} })
                expect(filtersChanged).toHaveBeenCalledWith({ ...defaultFilters, category: 'two' })
            })
        });
    });

    describe('Filter Sub-Categories:', function () {
        let filter: Element | null;
        beforeEach(() => {
            filter = renderedApp.container.querySelector('select[name="subCategory-filter"]')
        });

        test('should have a sub-categories filter', async () => {
            expect(filter).toBeInTheDocument();
        })

        describe('if sub-categories filter is changed', function () {
            test('should broadcast \'filtersChanged\'', async () => {
                fireEvent.change(filter!, {target: {value: 'two'}})
                expect(filtersChanged).toHaveBeenCalledWith({...defaultFilters, subCategory: 'two'})
            })
        });
    });

    describe('Filter updates:', function () {
        let filter: Element | null;
        beforeEach(() => {
            filter = renderedApp.container.querySelector('select[name="updates-filter"]')
        });

        test('should have a updates filter', async () => {
            expect(filter).toBeInTheDocument();
        })

        describe('if updates filter is changed', function () {
            test('should broadcast \'filtersChanged\'', async () => {
                const targetDate = moment().subtract(1, 'month').format('YYYY-MM-DD');
                fireEvent.change(filter!, {target: {value: targetDate}})
                expect(filtersChanged).toHaveBeenCalledWith({...defaultFilters, updatedDate: targetDate})
            })
        });
    });

    describe('Sorting:', function () {
        let filter: Element | null;
        beforeEach(() => {
            filter = renderedApp.container.querySelector('select[name="sorting-selector"]')
        });

        test('should have a sorting option', async () => {
            expect(filter).toBeInTheDocument();
        })

        describe('if sorting is changed', function () {
            test('should broadcast \'sortingChanged\'', async () => {
                fireEvent.change(filter!, {target: {value: 'match|asc'}})
                expect(sortingChanged).toHaveBeenCalledWith('match|asc')
            })
        });
    });

    test('should show screening results', async () => {
        const screeningResults = renderedApp.queryAllByTestId('screening-result-record-container')
        expect(screeningResults).toHaveLength(screeningResults.length)
    })
    describe('when clicked on summary viewer', () => {
        beforeEach(() => {
            const openers = renderedApp.queryAllByTestId('details-opener');
            fireEvent.click(openers[0]!);
        })
        test('should show summary', () => {
            const summary = renderedApp.queryByTestId('record-summary-container');
            expect(summary).toBeInTheDocument();
        })
    });

    describe("if results are less then 10", function() {
        test('should not show pagination in the bottom', async () => {
            const paginator = renderedApp.queryByTestId('paginator-container')
            expect(paginator).not.toBeInTheDocument();
        })
    });

    test('should show RecordsSummary component', async () => {
        const summary = renderedApp.queryByTestId('record-summary-container')
        expect(summary).toBeInTheDocument();
    })
});

