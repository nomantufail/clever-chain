import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import {defaultContext} from "src/utils/AppContext";
import BusinessRecordDetails from "../../components/BusinessRecordDetails";
import { business_mapped_entity_details, business_mapped_entity_details_no_tag } from "src/tests/mocks/recordDetails";
import jobEntitiesResponse from "src/tests/mocks/jobEntitiesResponse";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('BusinessRecordDetails', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;

    beforeEach(() => {
        markAsAuthenticated = jest.fn();

        renderedApp = renderWithContext(
          <BusinessRecordDetails recordDetails={business_mapped_entity_details} />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    test('should render Business record details component', () => {
        const detail = renderedApp.queryByTestId("business-record-details");
        expect(detail).toBeDefined();
    })

    describe('if details are not available', () => {
        beforeEach(() => {
            renderedApp.rerender(<BusinessRecordDetails recordDetails={business_mapped_entity_details_no_tag} />);
        })
        test('should show un-available tag', () => {
            const badgePills = renderedApp.queryAllByText('Not Available')
            expect(badgePills.length).toEqual(6);
        })
    })
});

