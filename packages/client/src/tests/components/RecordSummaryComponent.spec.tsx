import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import {defaultContext} from "src/utils/AppContext";
import RecordSummaryComponent from "../../components/RecordSummaryComponent";
import summary, {littleSummary} from "src/tests/mocks/dummyRecordSummary";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('RecordSummaryComponent', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;

    beforeEach(() => {
        markAsAuthenticated = jest.fn();

        renderedApp = renderWithContext(
            <RecordSummaryComponent
              summary={summary}
            />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    test('should show no summary if summary is not provided', () => {
        renderedApp = renderWithContext(
          <RecordSummaryComponent
            summary=''
          />,
          {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
        expect(renderedApp.queryByText('Select a match to view details')).toBeInTheDocument()
    })

    describe('if summary is provided', () => {
        beforeEach(() => {
            renderedApp.rerender(
              <RecordSummaryComponent
                summary={summary}
              />,
            );
        })
        it('should show \'Full report\' button', () => {
            expect(renderedApp.queryByTestId('view-full-report')).toBeInTheDocument()
        });
    })
});

