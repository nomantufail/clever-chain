import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {defaultContext} from "src/utils/AppContext";
import Paginator from "../../components/Paginator";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('Paginator', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;
    let searchParametersChanged: jest.Mock<any, any>
    let filtersChanged: jest.Mock<any, any>,
        currentPageChanged: jest.Mock<any, any>,
        setRecordsPerPage: jest.Mock<any, any>,
        sortingChanged: jest.Mock<any, any>
    let currentRecordsCount: number;
    let currentPage: number,
        totalRecordsAvailable: number,
        totalPages: number,
        currentRecordsPerPage: number,
        isScreening: boolean;

    beforeEach(() => {
        markAsAuthenticated = jest.fn();
        searchParametersChanged = jest.fn();
        filtersChanged = jest.fn();
        currentPageChanged = jest.fn();
        setRecordsPerPage = jest.fn();
        sortingChanged = jest.fn();

        currentRecordsCount = 10;
        currentPage = 1;
        totalRecordsAvailable = 10;
        totalPages = 1;
        isScreening = true;
        currentRecordsPerPage = 10;

        renderedApp = renderWithContext(
            <Paginator
                fetchPage={currentPageChanged}
                setRecordsPerPage={setRecordsPerPage}
                currentPage={currentPage}
                totalPages={totalPages}
                currentRecordsCount={currentRecordsCount}
                currentRecordsPerPage={currentRecordsPerPage}
                totalRecordsAvailable={totalRecordsAvailable}
            />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    test('should have a records per page dropdown settings', async () => {
        const recordsPerPage = renderedApp.container.querySelector('select[name="records-per-page-select"]');
        expect(recordsPerPage).toBeInTheDocument();
    });

    describe('when records-per-page setting changed', function () {
        test('should broadcast \'setRecordsPerPage\'', () => {
            const recordsPerPage = renderedApp.container.querySelector('select[name="records-per-page-select"]');
            fireEvent.change(recordsPerPage!, {target: {value: '15'}})

            expect(setRecordsPerPage).toHaveBeenCalledWith(15)
        })
    });

    test('should show current records count', () => {
        expect(renderedApp.container.querySelector('.current-records-count'))
            .toHaveTextContent(`${currentRecordsCount}`)
    })

    test('should show total available records count', () => {
        expect(renderedApp.container.querySelector('.total-available-records-count'))
            .toHaveTextContent(`${totalRecordsAvailable}`)
    })

    test('should have a page number input', async () => {
        const input = renderedApp.container.querySelector('input[name="current-page-input"]');
        expect(input).toBeInTheDocument();
    })

    test('should disable the page number input', async () => {
        const input = renderedApp.container.querySelector('input[name="current-page-input"]');
        expect(input).toHaveAttribute('disabled')
    })

    test('should have a forward button', () => {
        const input = renderedApp.container.querySelector('button[name="forward-btn"]');
        expect(input).toBeInTheDocument();
    })

    test('should have a backward button', () => {
        const input = renderedApp.container.querySelector('button[name="backward-btn"]');
        expect(input).toBeInTheDocument();
    })

    describe('if more then one pages available', function () {
        beforeEach(() => {
            renderedApp.rerender(
                <Paginator
                    fetchPage={currentPageChanged}
                    setRecordsPerPage={setRecordsPerPage}
                    currentPage={1}
                    totalPages={2}
                    currentRecordsCount={currentRecordsCount}
                    currentRecordsPerPage={currentRecordsPerPage}
                    totalRecordsAvailable={20}
                />,
            )
        })

        describe('if current page is not the last page', function () {
            let forwardBtn: Element | null;
            beforeEach(() => {
                forwardBtn = renderedApp.container.querySelector('button[name="forward-btn"]');
            })
            test('should enable the forward button', () => {
                expect(forwardBtn!).not.toHaveAttribute('disabled');
            })

            describe('when forward button clicked', function () {
                test('should broadcast \'currentPageChanged\' with provided number', () => {
                    fireEvent.click(forwardBtn!);
                    expect(currentPageChanged).toHaveBeenCalledWith(2)
                })
            });
        });

        describe('if current page is the last page', function () {
            beforeEach(() => {
                renderedApp.rerender(
                    <Paginator
                        fetchPage={currentPageChanged}
                        setRecordsPerPage={setRecordsPerPage}
                        currentPage={2}
                        totalPages={2}
                        currentRecordsCount={currentRecordsCount}
                        currentRecordsPerPage={currentRecordsPerPage}
                        totalRecordsAvailable={20}
                    />,
                )
            })

            test('should disable the forward button', () => {
                const forwardButton = renderedApp.container.querySelector('button[name="forward-btn"]');
                expect(forwardButton).toHaveAttribute('disabled')
            })
        });
    });

    describe('if currentPage is the first page', function () {
        beforeEach(() => {
            renderedApp.rerender(
                <Paginator
                    fetchPage={currentPageChanged}
                    setRecordsPerPage={setRecordsPerPage}
                    currentPage={1}
                    totalPages={2}
                    currentRecordsCount={currentRecordsCount}
                    currentRecordsPerPage={currentRecordsPerPage}
                    totalRecordsAvailable={20}
                />,
            )
        })
        test('should disable backward button', () => {
            const button = renderedApp.container.querySelector('button[name="backward-btn"]');
            expect(button).toHaveAttribute('disabled');
        })
    });

    describe('if currentPage is not the first page', function () {
        let backButton: Node | Window | null;
        beforeEach(() => {
            renderedApp.rerender(
                <Paginator
                    fetchPage={currentPageChanged}
                    setRecordsPerPage={setRecordsPerPage}
                    currentPage={2}
                    totalPages={3}
                    currentRecordsCount={currentRecordsCount}
                    currentRecordsPerPage={currentRecordsPerPage}
                    totalRecordsAvailable={30}
                />,
            )
            backButton = renderedApp.container.querySelector('button[name="backward-btn"]');
        })
        test('should enable the backward button', () => {
            expect(backButton).not.toHaveAttribute('disabled');
        })

        describe('when clicked on backward button', function () {
            test('should broadcast \'currentPageChanged\' with provided number', () => {
                fireEvent.click(backButton!);
                expect(currentPageChanged).toHaveBeenCalledWith(1)
            })
        });
    });
});

