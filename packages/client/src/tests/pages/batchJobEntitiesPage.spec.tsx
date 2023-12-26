import React from "react";
import server, { jobEntitiesApiReturning_401 } from "src/tests/mocks/server";
import { RenderResult, renderAsRouteComponent } from "src/tests/testUtils";
import { BatchJobEntitiesPage } from "src/pages";
import { defaultContext } from "src/utils/AppContext";
import jobEntitiesResponse from "src/tests/mocks/jobEntitiesResponse";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("render batch job entities page", function() {
  let loginButton: any;
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;

  beforeEach(async () => {
    markAsAuthenticated = jest.fn();
    renderedApp = renderAsRouteComponent(
      <BatchJobEntitiesPage />,
      {
        defaultContext: { ...defaultContext, markAsAuthenticated },
        currentRoute: "/batch-screening/job-entities/1234",
        path: "/batch-screening/job-entities/:jobId"
      }
    );
    await renderedApp.findByText(jobEntitiesResponse.jobTitle);
  });

  test("should show the job title", async () => {
    expect(renderedApp.container.querySelector(".job-title")).toHaveTextContent(`UK_individuals`);
  });

  test("should show the bach button", async () => {
    expect(renderedApp.container.querySelector(".back-btn")).toBeInTheDocument();
  });

  test("should show the job-entities-grid", async () => {
    expect(renderedApp.container.querySelector(".job-entities-grid")).toBeInTheDocument();
  });

  describe("when api returns an error", () => {
    beforeEach(async () => {
      server.use(jobEntitiesApiReturning_401);
      renderedApp = renderAsRouteComponent(
        <BatchJobEntitiesPage />,
        {
          defaultContext: { ...defaultContext, markAsAuthenticated },
          currentRoute: "/batch-screening/job-entities/1234",
          path: "/batch-screening/job-entities/:jobId"
        }
      );
      await renderedApp.findByText('n/a');
    });

    test("should show the job title as n/a", async () => {
      expect(renderedApp.container.querySelector(".job-title")).toHaveTextContent(`n/a`);
    });

  });
});
