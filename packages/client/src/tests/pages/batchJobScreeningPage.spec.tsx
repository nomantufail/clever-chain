import React from "react";
import axios from "axios";
import server, {
  jobsApiReturning_401
} from "src/tests/mocks/server";
import { RenderResult, renderAsRouteComponent, fireEvent } from "src/tests/testUtils";
import { BatchScreeningPage } from "src/pages";
import { act, cleanup, waitFor } from "@testing-library/react";
import { defaultContext } from "src/utils/AppContext";
import axiosInstance from "src/services/axiosInstance.service";


describe("Batch screening page", function() {
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;

  beforeAll(() => {
    server.listen();
  });
  afterEach(() => {
    server.resetHandlers();
    cleanup();
  });
  afterAll(() => {
    server.close();
  });

  beforeEach(async () => {
    markAsAuthenticated = jest.fn();
    renderedApp = renderAsRouteComponent(
      <BatchScreeningPage />,
      {
        defaultContext: { ...defaultContext, markAsAuthenticated },
        currentRoute: "/batch-screening",
        path: "/batch-screening"
      }
    );
    await renderedApp.findAllByTestId("job-item");
  });

  test("should show the batch upload form", async () => {
    expect(renderedApp.queryByTestId("batch-upload-form")).toBeInTheDocument();
  });

  test("should show the jobs-grid", async () => {
    expect(renderedApp.queryByTestId("jobs-grid")).toBeInTheDocument();
  });

  describe("when api returns an error", () => {
    beforeEach(async () => {
      server.use(jobsApiReturning_401);
      renderedApp = renderAsRouteComponent(
        <BatchScreeningPage />,
        {
          defaultContext: { ...defaultContext, markAsAuthenticated },
          currentRoute: "/batch-screening",
          path: "/batch-screening"
        }
      );
      await renderedApp.findByText("Something went wrong");
    });

    test("should not show the jobs grid", async () => {
      expect(await renderedApp.findByText("Something went wrong")).toBeInTheDocument();
    });
  });

  describe("when form is submitted with the proper values", () => {
    // let mockedAxios;
    beforeEach(async () => {
      // mockedAxios = axiosInstance as jest.Mocked<typeof axios>;
      // mockedAxios.post.mockResolvedValue({});
      // const fileUploadBtn = renderedApp.container.querySelector("input[name=\"file_input\"]");
      // fireEvent.change(fileUploadBtn!, { target: { files: [{ name: "file-name" }] } });
      //
      // const customerType = renderedApp.container.querySelector("select[name=\"customer_type_select\"]");
      // fireEvent.change(customerType!, { target: { value: "Business" } });
      //
      // const submitBtn = renderedApp.container.querySelector("button[name=\"submit-form-btn\"]");
      // fireEvent.click(submitBtn!);
      // await renderedApp.findByText(/File uploaded successfully/i);
    });

    test("it should submit the form successfully", async () => {
      // expect(renderedApp.queryByText(/File uploaded successfully/i)).toBeInTheDocument();
    });
  });

  describe('when filters changed', () => {
    test('should load the data accordingly', async () => {
      const filter = renderedApp.container.querySelector('select[name="allCustomers"]')
      fireEvent.change(filter!, { target: { value: 'Individual'} })
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
