import React from "react";
import server, { businessScanningApiReturning_500, loginApiReturning_403 } from "src/tests/mocks/server";
import * as notify from "src/services/notification.service";
import { renderWithContext, fireEvent, RenderResult } from "src/tests/testUtils";
import userEvent from "@testing-library/user-event";
import { BusinessLightScreeningPage, LoginPage } from "src/pages";
import { waitFor } from "@testing-library/react";
import { defaultContext } from "src/utils/AppContext";
import * as constants from "src/constants";
import { LightningScreeningLayout } from "../../layouts";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("render Business real time screening page", function() {
  let loginButton: any;
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;

  beforeEach(() => {
    markAsAuthenticated = jest.fn();
    renderedApp = renderWithContext(
      <LightningScreeningLayout>
        <BusinessLightScreeningPage />
      </LightningScreeningLayout>,
      { defaultContext: { ...defaultContext, markAsAuthenticated } }
    );
  });

  describe("when user clicks on 'Screen' button", () => {
    let screenBtn: Element | null,
      nameInput: Element | null,
      registrationNumber: Element | null,
      addressLine1: Element | null,
      addressLine2: Element | null,
      city: Element | null,
      county: Element | null,
      postalCode: Element | null,
      country: Element | null;

    beforeEach(() => {
      screenBtn = renderedApp.container.querySelector("button[type=\"submit\"]");
      nameInput = renderedApp.container.querySelector("input[name=\"name\"]");
      registrationNumber = renderedApp.container.querySelector("input[name=\"registration_number\"]");
      addressLine1 = renderedApp.container.querySelector("input[name=\"address_line_1\"]");
      addressLine2 = renderedApp.container.querySelector("input[name=\"address_line_2\"]");
      city = renderedApp.container.querySelector("input[name=\"city\"]");
      county = renderedApp.container.querySelector("input[name=\"county\"]");
      postalCode = renderedApp.container.querySelector("input[name=\"postal_code\"]");
      country = renderedApp.container.querySelector("select[name=\"country\"]");

      userEvent.type(nameInput!, "dummy name");
      userEvent.type(registrationNumber!, "dummy registration number");
      userEvent.type(addressLine1!, "dummy addr line 1");
      userEvent.type(addressLine2!, "dummy addr line 2");
      userEvent.type(city!, "dummy city");
      userEvent.type(county!, "dummy county");
      userEvent.type(postalCode!, "dummy postal code");
    });
    describe("If form was valid", function() {
      beforeEach(async () => {
        fireEvent.click(screenBtn!);
        await renderedApp.findAllByTestId('screening-result-record-container');
      })
      test("should broadcast to screen business", async () => {
        expect(renderedApp.queryAllByTestId('screening-result-record-container').length).toBeGreaterThan(0);
      });

      describe('when filters changed', () => {
        test('should load the data accordingly', async () => {
          const filter = renderedApp.container.querySelector('select[name="category-filter"]')
          fireEvent.change(filter!, { target: { value: 'SOE'} })
          expect(await renderedApp.findByTestId('loaded')).toBeInTheDocument()
        })
      })

      describe('when sorting changed', () => {
        test('should load the data accordingly', async () => {
          const filter = renderedApp.container.querySelector('select[name="sorting-selector"]')
          fireEvent.change(filter!, { target: { value: 'match|asc'} })
          expect(await renderedApp.findByTestId('loaded')).toBeInTheDocument()
        })
      })

      describe('when recordings per page changed changed', () => {
        test('should load the data accordingly', async () => {
          const filter = renderedApp.container.querySelector('select[name="records-per-page-select"]')
          fireEvent.change(filter!, { target: { value: '15'} })
          expect(await renderedApp.findByTestId('loaded')).toBeInTheDocument()
        })
      })

      describe('when current page changed changed', () => {
        test('should load the data accordingly', async () => {
          const filter = renderedApp.container.querySelector('button[name="forward-btn"]')
          fireEvent.click(filter!)
          expect(await renderedApp.findByTestId('loaded')).toBeInTheDocument()
        })
      })
    });

    describe("if network call failed due to any reason", function() {
      beforeEach(() => {
        server.use(businessScanningApiReturning_500)
      })
      test("should not show the results grid component", async () => {
        fireEvent.click(screenBtn!);
        expect(await renderedApp.findByText(/Something went wrong/i)).toBeInTheDocument();
      });
    });
  });
});
