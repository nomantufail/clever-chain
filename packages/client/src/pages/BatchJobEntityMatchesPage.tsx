import React, { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IBusinessScreenedResult, IBusinessScreeningSearchParams, IScreeningResultsFilters } from "../types";
import IScreenedResult from "@cc/shared-service/src/server/types/response/partials/IScreenedResult";
import * as screeningService from "../services/screening.service";
import * as notificationService from "../services/notification.service";
import MatchLiklihoodCards from "../components/MatchLiklihoodCards";
import ResultsGrid from "../components/ResultsGrid";
import { LikliHood } from "src/enums";
import * as notify from "src/services/notification.service";

const BatchJobEntitiesPage: React.FC = () => {
  const { jobId, jobEntityId } = useParams();
  const [screenedResults, setScreenedResults] = useState<IScreenedResult[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string>("");
  const [pageStates, setPageStates] = useState<string[]>([""]);
  const [currentRecordsPerPage, setCurrentRecordsPerPage] = useState<number>(10);
  const [totalRecordsAvailable, setTotalRecordsAvailable] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<IScreeningResultsFilters>({
    selectedLikliHood: LikliHood.All,
    subCategory: "",
    category: "",
    database: "",
    updatedDate: ""
  });
  const [filtersData, setFiltersData] = useState({
    categories: [],
    subcategories: [],
    databases: []
  });
  const [sortBy, setSortBy] = useState<string>("match|desc");
  const [searchParameters, setSearchParameters] = useState<IBusinessScreeningSearchParams>();
  const [selectedLikliHood, setSelectedLikliHood] = useState("");
  const [likliHoodsCount, setLikliHoodsCount] = useState({
    exact: 0,
    veryHigh: 0,
    high: 0,
    medium: 0,
    low: 0,
    veryLow: 0
  });
  const [jobTitle, setJobTitle] = useState("");
  const [jobEntityName, setJobEntityName] = useState("");

  const fetchScreenedResults = () => {
    setIsLoading(true);
    screeningService.getScreenedJobMatches(
      jobId,
      jobEntityId,
      { ...filters, selectedLikliHood },
      nextPage,
      currentRecordsPerPage,
      sortBy
    )
      // @ts-ignore
      .then((response) => {
        const data = response.data.data;
        setScreenedResults(data.results);
        setTotalPages(data.paging.totalPages);
        setPageStates([...pageStates, data.paging.nextPage]);
        setNextPage(data.paging.nextPage || "");
        setTotalRecordsAvailable(data.paging.totalRecordsAvailable);
        setLikliHoodsCount(data.counts);
        setFiltersData(data.filtersData);
        setJobTitle(data.jobTitle);
        setJobEntityName(data.jobEntityName);
      })
      .catch(err => {
        if (!err.response.handled) {
          if (err.response && err.response.data && err.response.data.error.message)
            notify.error(err.response.data.error.message);
        }
        setScreenedResults([]);
        setTotalPages(0);
        setNextPage("");
        setTotalRecordsAvailable(0);
        setLikliHoodsCount({ exact: 0, veryHigh: 0, high: 0, medium: 0, low: 0, veryLow: 0 });
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const likliHoodChanged = async (likliHood: string) => {
    removePages();
    setSelectedLikliHood(likliHood);
  };
  const currentPageChanged = async (pageNumber: number) => {
    const pageStatesCopy = [...pageStates];
    if (pageNumber > currentPage) {
      setNextPage(pageStatesCopy[pageStatesCopy.length - 1] || "");
    } else {
      // pop top two pages
      pageStatesCopy.pop();
      pageStatesCopy.pop();
      setNextPage(pageStatesCopy[pageStatesCopy.length - 1] || "");
    }
    setPageStates([...pageStatesCopy]);
    setCurrentPage(pageNumber);
  };
  const setRecordsPerPage = async (recordsCount: number) => {
    removePages();
    setCurrentRecordsPerPage(recordsCount);
  };
  const filtersChanged = async (filters: IScreeningResultsFilters) => {
    removePages();
    setFilters(filters);
  };
  const sortingChanged = async (sort: string) => {
    removePages();
    setSortBy(sort);
  };

  useEffect(() => {
    fetchScreenedResults();
  }, [filters, currentPage, currentRecordsPerPage, sortBy, selectedLikliHood]);

  const removePages = () => {
    setPageStates([""]);
    setNextPage("");
    setCurrentPage(1);
  };

  const downloadCsv = async () => {
    window.open(`${process.env.REACT_APP_BASE_URL}export/csv/?entityId=${jobEntityId}`, "_blank", "noopener,noreferrer");
  };
  return <div>
    <div className="row">
      <div className="col-lg-12">
        <div className="card-title d-flex justify-content-between align-items-center">
          <h4 className="color-monoIntense fw-medium">
            <Link to={`/batch-screening/job-entities/${jobId}`}>
              <button className="back-btn">
                <img src={require("../assets/images/icons/back-arrow.svg").default} alt="" />
              </button>
            </Link> {jobTitle} <span className="fw-bold color-green">/</span> {jobEntityName}
          </h4>
        </div>
      </div>
      <div className="col-lg-12">
        <div className="card-title d-flex justify-content-between align-items-center">
          <h4>RESULTS ({totalRecordsAvailable} Matches)</h4>
          <button className="button btn-with-icon md" onClick={downloadCsv}><img
            src={require("../assets/images/icons/download-icon.svg").default} alt="" /> Export
          </button>
        </div>
      </div>
      <div className="col-lg-12">
        <MatchLiklihoodCards
          likliHoodChanged={likliHoodChanged}
          likliHoodsCount={likliHoodsCount}
        />
      </div>
      <ResultsGrid
        results={screenedResults}
        fetchPage={currentPageChanged}
        currentPage={currentPage}
        currentRecordsPerPage={currentRecordsPerPage}
        setRecordsPerPage={setRecordsPerPage}
        totalRecordsAvailable={totalRecordsAvailable}
        totalPages={totalPages}
        filtersChanged={filtersChanged}
        filtersData={filtersData}
        isScreening={isLoading}
        sortingChanged={sortingChanged}
        sortBy={sortBy}
      />
    </div>
  </div>;
};

export default BatchJobEntitiesPage;
