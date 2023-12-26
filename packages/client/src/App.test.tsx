import React from 'react';
import App from 'src/App';
import server from "./tests/mocks/server";
import {render} from './tests/testUtils';

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

test('renders app', async () => {
    const {getByTestId} = render(<App/>);
    const loginButton = getByTestId('login-button');
    expect(loginButton).toHaveTextContent('Login');
});
