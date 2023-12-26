import React from "react";
import server, { matchFullReportApiReturning_500 } from "src/tests/mocks/server";
import { RenderResult, renderAsRouteComponent } from "src/tests/testUtils";
import { MatchFullReportPage } from "src/pages";
import { defaultContext } from "src/utils/AppContext";

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
      <MatchFullReportPage />,
      {
        defaultContext: { ...defaultContext, markAsAuthenticated },
        currentRoute: "/match/full-report/5678",
        path: "/match/full-report/:matchId"
      }
    );
    await renderedApp.findByText('General Information');
  });

  test("should show the match name", async () => {
    expect(renderedApp.container.querySelector(".match-name")).toHaveTextContent(`Berlusconi, Silvio`);
  });

  test("should show the general information", async () => {
    expect(await renderedApp.findByText('General Information')).toBeInTheDocument();
  });

  test("should show the Address and Location", async () => {
    expect(await renderedApp.findByText('Address and Location')).toBeInTheDocument();
  });

  test("should show the Other Addresses", async () => {
    expect(await renderedApp.findByText('Other Addresses')).toBeInTheDocument();
  });

  test("should show the FINDING", async () => {
    expect(await renderedApp.findByText('FINDING')).toBeInTheDocument();
  });

  test("should show the PROFILE NOTES", async () => {
    expect(await renderedApp.findByText('PROFILE NOTES')).toBeInTheDocument();
  });

  test("should show the Source links", async () => {
    expect(await renderedApp.findByText('Source links')).toBeInTheDocument();
  });

  describe("when api returns an error", () => {
    beforeEach(async () => {
      server.use(matchFullReportApiReturning_500);
      renderedApp = renderAsRouteComponent(
        <MatchFullReportPage />,
        {
          defaultContext: { ...defaultContext, markAsAuthenticated },
          currentRoute: "/batch-screening/job-entities/1234",
          path: "/batch-screening/job-entities/:jobId"
        }
      );
    });

    test("should show the appropriate error message", async () => {
      // expect(renderedApp.container.querySelector(".job-title")).toHaveTextContent(`n/a`);
    });

  });
});
