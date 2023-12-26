import React from "react";
import server from "src/tests/mocks/server";
import { renderWithContext, fireEvent, RenderResult } from "src/tests/testUtils";
import { defaultContext } from "src/utils/AppContext";
import ResultsGrid from "src/components/ResultsGrid";
import JobEntitiesGrid from "src/components/batch-screening/JobEntitiesGrid";
import jobEntitiesResponse from "src/tests/mocks/jobEntitiesResponse";
import jobEntitiesFiltersData from "src/tests/mocks/JobEntitiesFiltersData";
import MatchLiklihoodCards from "src/components/MatchLiklihoodCards";
import { LikliHood } from "src/enums";

beforeAll(() => server.listen());
afterEach(() => {
  server.resetHandlers();
});
afterAll(() => server.close());

describe("JobEntitiesGrid component:", function() {
  let loginButton: any;
  let renderedApp: RenderResult;
  let markAsAuthenticated: jest.Mock<any, any>;
  let filtersChanged: jest.Mock<any, any>,
    currentPageChanged: jest.Mock<any, any>,
    setRecordsPerPage: jest.Mock<any, any>,
    sortingChanged: jest.Mock<any, any>;
  let screenedResults: any[] = [{}, {}, {}];
  let currentPage: number,
    totalRecordsAvailable: number,
    totalPages: number,
    currentRecordsPerPage: number,
    isScreening: boolean,
    sortBy: string;
  let defaultFilters = {
    database: "",
    category: "",
    match: ""
  };

  beforeEach(() => {
    markAsAuthenticated = jest.fn();
    filtersChanged = jest.fn();
    currentPageChanged = jest.fn();
    setRecordsPerPage = jest.fn();
    sortingChanged = jest.fn();

    screenedResults = [];
    currentPage = 1;
    totalRecordsAvailable = 0;
    totalPages = 1;
    isScreening = true;
    sortBy = "Highest match";
    currentRecordsPerPage = 10;

    renderedApp = renderWithContext(
      <JobEntitiesGrid
        jobId={"1234"}
        jobEntities={jobEntitiesResponse.results}
        fetchPage={currentPageChanged}
        currentPage={currentPage}
        currentRecordsPerPage={currentRecordsPerPage}
        setRecordsPerPage={setRecordsPerPage}
        totalRecordsAvailable={totalRecordsAvailable}
        totalPages={totalPages}
        filtersData={jobEntitiesFiltersData}
        filtersChanged={filtersChanged}
        isLoading={false}
      />,
      { defaultContext: { ...defaultContext, markAsAuthenticated } }
    );
  });

  describe("Filter Matches:", function() {
    let filter: Element | null;
    beforeEach(() => {
      filter = renderedApp.container.querySelector("select[name=\"matches-filter\"]");
    });

    test("should have a match filter", async () => {
      expect(filter).toBeInTheDocument();
    });

    describe("if match filter is changed", function() {
      test("should broadcast 'filtersChanged'", async () => {
        fireEvent.change(filter!, { target: { value: "Exact" } });
        expect(filtersChanged).toHaveBeenCalledWith({ ...defaultFilters, match: LikliHood.ExactMatch });
      });
    });
  });

  describe("Filter Databases:", function() {
    let filter: Element | null;
    beforeEach(() => {
      filter = renderedApp.container.querySelector("select[name=\"database-filter\"]");
    });

    test("should have a databases filter", async () => {
      expect(filter).toBeInTheDocument();
    });

    describe("if databases filter is changed", function() {
      test("should broadcast 'filtersChanged'", async () => {
        fireEvent.change(filter!, { target: { value: "two" } });
        expect(filtersChanged).toHaveBeenCalledWith({ ...defaultFilters, database: "two" });
      });
    });
  });

  describe("Filter Categories:", function() {
    let filter: Element | null;
    beforeEach(() => {
      filter = renderedApp.container.querySelector("select[name=\"category-filter\"]");
    });

    test("should have a category filter", async () => {
      expect(filter).toBeInTheDocument();
    });

    describe("if category filter is changed", function() {
      test("should broadcast 'filtersChanged'", async () => {
        fireEvent.change(filter!, { target: { value: "two" } });
        expect(filtersChanged).toHaveBeenCalledWith({ ...defaultFilters, category: "two" });
      });
    });
  });

  test("should show screening results", async () => {
    const screeningResults = renderedApp.queryAllByTestId("job-entity-list-item");
    expect(screeningResults).toHaveLength(jobEntitiesResponse.results.length);
  });

  test("should show pagination in the bottom", async () => {
    const paginator = renderedApp.queryByTestId("paginator-container");
    expect(paginator).toBeInTheDocument();
  });
});

