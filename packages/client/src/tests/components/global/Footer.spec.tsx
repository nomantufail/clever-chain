import React from 'react';
import server from 'src/tests/mocks/server';
import {renderWithContext, fireEvent, RenderResult} from 'src/tests/testUtils';
import userEvent from '@testing-library/user-event'
import {defaultContext} from "src/utils/AppContext";
import Footer from "src/components/global/Footer";

beforeAll(() => server.listen())
afterEach(() => {
  server.resetHandlers()
})
afterAll(() => server.close())

describe('Footer', function () {
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;
  beforeEach(() => {
    markAsAuthenticated = jest.fn();

    renderedApp = renderWithContext(
      <Footer/>,
      {defaultContext: {...defaultContext, markAsAuthenticated}}
    );
  });

  test('should have a \'Powered by\' text', () => {
    expect(renderedApp.queryByText('Powered by')).toBeInTheDocument()
  })
})
