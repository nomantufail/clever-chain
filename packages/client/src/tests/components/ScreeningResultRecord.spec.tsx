import React from 'react';
import server, {loginApiReturning_403} from 'src/tests/mocks/server';
import * as notify from 'src/services/notification.service';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {BusinessLightScreeningPage, LoginPage} from "src/pages";
import {waitFor} from "@testing-library/react";
import {defaultContext} from "src/utils/AppContext";
import * as constants from "src/constants";
import {LightningScreeningLayout} from "src/layouts";
import BusinessSearchForm from "src/components/real-time-screening/BusinessSearchForm";
import ScreeningResultRecord from "../../components/ScreeningResultRecord";
import record from "src/tests/mocks/resultRecord";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('ScreeningResultRecord', function () {
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;
    let setOpenedRecord: jest.Mock<any, any>;

    beforeEach(() => {
        markAsAuthenticated = jest.fn();
        setOpenedRecord = jest.fn();

        renderedApp = renderWithContext(
            <ScreeningResultRecord
                record={{ ...record}}
                setOpenedRecord={setOpenedRecord}
                openedRecord={'123'}
            />,
            {defaultContext: {...defaultContext, markAsAuthenticated}}
        );
    });

    test('should show all columns', () => {});

    test('should show details button', () => {});

    test('should show hover effect on matching criteria', () => {});

    test('should hide all details by default', () => {})

    describe('when clicked on show details button', () => {
        describe('if details were already shown', function () {
            test('should hide details', () => {

            })
        });

        describe('if details were hidden', function () {
            test('should show details', () => {

            })
        });
    })
});

