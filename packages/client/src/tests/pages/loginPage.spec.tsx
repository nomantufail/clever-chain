import React from 'react';
import server, {loginApiReturning_403} from 'src/tests/mocks/server';
import * as notify from 'src/services/notification.service';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {LoginPage} from "src/pages";
import {waitFor} from "@testing-library/react";
import {defaultContext} from "src/utils/AppContext";
import * as constants from "src/constants";

beforeAll(() => server.listen())
afterEach(() => {
    server.resetHandlers()
})
afterAll(() => server.close())

describe('render login page', function () {
    let loginButton: any;
    let renderedApp: RenderResult;
    let markAsAuthenticated: jest.Mock<any, any>;

    beforeEach(() => {
        markAsAuthenticated = jest.fn();
        renderedApp = renderWithContext(<LoginPage />, {defaultContext: {...defaultContext, markAsAuthenticated}});
        loginButton = renderedApp.getByTestId('login-button');
    });

    test('should have a login button', async () => {
        expect(loginButton).toHaveTextContent('Login');
    });

    describe('when user clicks on login button', function () {
        describe('if login is not successful', function () {
            beforeEach(() => {
                server.use(loginApiReturning_403)

                jest.spyOn(notify, 'error')

                const username = renderedApp.container.querySelector('#username')
                const password = renderedApp.container.querySelector('#password')
                userEvent.type(username!, 'noman')
                userEvent.type(password!, 'noman143')

                fireEvent.click(loginButton);
            });
            it('should notify user that credentials were invalid', async () => {
                await waitFor(() => expect(notify.error).toHaveBeenCalledTimes(1))
                expect(notify.error).toHaveBeenCalledWith(constants.TEXT_INVALID_CREDENTIALS);
            });
        });

        describe('if login was successful', () => {
            beforeEach(() => {
                const username = renderedApp.container.querySelector('#username')
                const password = renderedApp.container.querySelector('#password')
                userEvent.type(username!, 'noman')
                userEvent.type(password!, 'noman143')

                fireEvent.click(loginButton);
            });
            it('should mark user as authenticated', async () => {
                await waitFor(() => expect(markAsAuthenticated).toHaveBeenCalledTimes(1))
                expect(markAsAuthenticated).toHaveBeenCalledTimes(1);
                expect(true).toEqual(true)
            });
        });
    });
});
