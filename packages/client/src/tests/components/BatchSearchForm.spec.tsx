import React from "react";
import server from "src/tests/mocks/server";
import { renderWithContext, fireEvent, RenderResult } from "src/tests/testUtils";
import { defaultContext } from "src/utils/AppContext";
import BatchSearchForm from "src/components/batch-screening/BatchSearchForm";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("BatchSearchForm component:", function() {
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;
  let screen: jest.Mock<any, any>;
  beforeEach(() => {
    markAsAuthenticated = jest.fn();
    screen = jest.fn();
    renderedApp = renderWithContext(
      <BatchSearchForm
        screen={screen}
      />,
      { defaultContext: { ...defaultContext, markAsAuthenticated } }
    );
  });

  test('it should have a file upload button', () => {
    const fileUploadBtn = renderedApp.container.querySelector('input[name="file_input"]')
    expect(fileUploadBtn).toBeInTheDocument();
  });

  test('it should have a customer type select', () => {
    const customerType = renderedApp.container.querySelector('select[name="customer_type_select"]')
    expect(customerType).toBeInTheDocument();
  });

  test('it should have a clear button', () => {
    const clearBtn = renderedApp.container.querySelector('button[name="clear-form-btn"]')
    expect(clearBtn).toBeInTheDocument();
  });

  test('it should have a submit button', () => {
    const submitBtn = renderedApp.container.querySelector('button[name="submit-form-btn"]')
    expect(submitBtn).toBeInTheDocument();
  });

  describe('when form is submitted with the proper values', () => {
    beforeEach(async () => {
      const fileUploadBtn = renderedApp.container.querySelector('input[name="file_input"]')
      fireEvent.change(fileUploadBtn!, { target: { files: [{ name: 'file-name' }]} })

      const customerType = renderedApp.container.querySelector('select[name="customer_type_select"]')
      fireEvent.change(customerType!, { target: { value: 'Business' } })

      const submitBtn = renderedApp.container.querySelector('button[name="submit-form-btn"]')
      fireEvent.click(submitBtn!);
    })
    test('it should call the screening function with proper values', () => {
      expect(screen).toHaveBeenCalled();
    })
  })
});

