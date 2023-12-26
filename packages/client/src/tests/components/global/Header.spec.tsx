import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {defaultContext} from "src/utils/AppContext";
import Header from "src/components/global/Header";

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe('Header', function () {
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;
  let currentUser: { username: string }
  let logout: jest.Mock<any, any>;
  beforeEach(() => {
    markAsAuthenticated = jest.fn();
    logout = jest.fn();
    currentUser = { username: 'Test-User' }
    renderedApp = renderWithContext(
      <Header/>,
      {defaultContext: {...defaultContext, markAsAuthenticated, logout, currentUser }}
    );
  });

  test('should show username', () => {
    expect(renderedApp.queryByText('Test-User')).toBeInTheDocument()
  })

  test('logout', () => {
    const logoutbtn = renderedApp.queryByTestId('logout-btn');
    fireEvent.click(logoutbtn!);

    expect(logout).toBeCalled();
  })
})
