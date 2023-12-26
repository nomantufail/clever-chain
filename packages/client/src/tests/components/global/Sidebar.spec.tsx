import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {defaultContext} from "src/utils/AppContext";
import Sidebar from "src/components/global/Sidebar";

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe('Sidebar', function () {
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;
  let currentUser: { username: string }
  let logout: jest.Mock<any, any>;
  beforeEach(() => {
    markAsAuthenticated = jest.fn();
    logout = jest.fn();
    currentUser = { username: 'Test-User' }
    renderedApp = renderWithContext(
      <Sidebar/>,
      {defaultContext: {...defaultContext, markAsAuthenticated, logout, currentUser }}
    );
  });

  test('should show Dashboard lnk', () => {
    expect(renderedApp.queryByText('Dashboard')).toBeInTheDocument()
  })

  test('should show Batch screening lnk', () => {
    expect(renderedApp.queryByText('Batch Screening')).toBeInTheDocument()
  })

  test('should show real time screening lnk', () => {
    expect(renderedApp.queryByText('Real-Time Screening')).toBeInTheDocument()
  })

})
