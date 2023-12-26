import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import {defaultContext} from "src/utils/AppContext";
import IndividualRecordDetails from "../../components/IndividualRecordDetails";
import { individual_mapped_entity_details, individual_mapped_entity_details_no_tag } from "src/tests/mocks/recordDetails";
import jobEntitiesResponse from "src/tests/mocks/jobEntitiesResponse";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('IndividualRecordDetails', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;

    beforeEach(() => {
        markAsAuthenticated = jest.fn();

        renderedApp = renderWithContext(
          <IndividualRecordDetails recordDetails={individual_mapped_entity_details} />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    test('should render Individual record details component', () => {
        const detail = renderedApp.queryByTestId("individual-record-details");
        expect(detail).toBeDefined();
    })

    describe('if details are not available', () => {
        beforeEach(() => {
            renderedApp.rerender(<IndividualRecordDetails recordDetails={individual_mapped_entity_details_no_tag} />);
        })
        test('should show un-available tag', () => {
            const badgePills = renderedApp.queryAllByText('Not Available')
            expect(badgePills.length).toEqual(7);
        })
    })
});

