import React, { useEffect, useRef, useState } from "react";
import MatchLiklihoodCards from "src/components/MatchLiklihoodCards";
import ResultsGrid from "../components/ResultsGrid";
import {
  IScreeningResultsFilters,
  IIndividualScreeningSearchParams
} from "src/types";
import IScreenedResult from "@cc/shared-service/src/server/types/response/partials/IScreenedResult";
import * as screeningService from "src/services/screening.service";
import IndividualSearchForm from "../components/real-time-screening/IndividualSearchForm";
import { LikliHood } from "src/enums";
import * as notify from "src/services/notification.service";
import * as paginationService from "src/services/pagination.service";


const IndividualLightScreeningPage: React.FC = () => {
  const [pristine, setPristine] = useState<boolean>(true);
  const [screenedResults, setScreenedResults] = useState<IScreenedResult[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string>("");
  const [pageStates, setPageStates] = useState<string[]>([""]);
  const [currentRecordsPerPage, setCurrentRecordsPerPage] = useState<number>(10);
  const [totalRecordsAvailable, setTotalRecordsAvailable] = useState<number>(0);
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [jobEntityId, setJobEntityId] = useState('');
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
  const [searchParameters, setSearchParameters] = useState<IIndividualScreeningSearchParams>();
  const [selectedLikliHood, setSelectedLikliHood] = useState("");
  const [likliHoodsCount, setLikliHoodsCount] = useState({
    exact: 0,
    veryHigh: 0,
    high: 0,
    medium: 0,
    low: 0,
    veryLow: 0
  });
  const [screeningComplete, setScreeningComplete] = useState(false);
  let searchParamsChanged = useRef(false);

  const startScreening = () => {
    setIsScreening(true);
    screeningService.screenIndividual(
      searchParameters!,
      { ...filters, selectedLikliHood },
      nextPage,
      currentRecordsPerPage,
      sortBy,
      jobEntityId
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
        setScreeningComplete(true);
        setJobEntityId(data.jobEntityId);
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
        setScreeningComplete(false);
      })
      .finally(() => {
        setIsScreening(false);
        if (searchParamsChanged.current) {
          searchParamsChanged.current = false;
        }
      });
  };

  const clearAllFilters = () => {
    setNextPage("");
    setFilters({
      selectedLikliHood: LikliHood.All,
      subCategory: "",
      category: "",
      database: "",
      updatedDate: ""
    });
    setSortBy("");
    setSelectedLikliHood(LikliHood.All);
  };

  const searchParametersChanged = async (params: IIndividualScreeningSearchParams) => {
    setScreeningComplete(false);
    setPristine(false);
    searchParamsChanged.current = true;
    setSearchParameters(params);
    setJobEntityId('');
    clearAllFilters();
  };

  const likliHoodChanged = async (likliHood: string) => {
    removePages();
    setSelectedLikliHood(likliHood);
  };
  const currentPageChanged = async (pageNumber: number) => {
    const { nextPage, computedPageStates } = paginationService.computeNextPage(currentPage, pageNumber, pageStates);
    setNextPage(nextPage);
    setPageStates(computedPageStates);
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
    if (!pristine) {
      // todo: do validation
      startScreening();
    }
  }, [searchParameters, filters, currentPage, currentRecordsPerPage, sortBy, pristine, selectedLikliHood]);

  const removePages = () => {
    setPageStates([""]);
    setNextPage("");
    setCurrentPage(1);
  };

  const downloadCsv = async () => {
    //todo: add this condition later.
    // if (screenedResults.length) {
    window.open(`${process.env.REACT_APP_BASE_URL}export/csv/?entityId=${screenedResults[0].job_entity_id}`, "_blank", "noopener,noreferrer");
    // } else {
    //     notificationService.warning('No records found')
    // }
  };

  return (
    <>
      <IndividualSearchForm
        screen={searchParametersChanged}
        screeningComplete={screeningComplete}
      />

      <div className="row">
        <div className="col-lg-12 mt-10">
          <div className="card-title d-flex justify-content-between align-items-center">
            <h4>RESULTS</h4>
            <button
              className="button btn-with-icon md"
              onClick={downloadCsv}
            >
              <img src={require("src/assets/images/icons/download-icon.svg").default} alt="" /> Export
            </button>
          </div>
        </div>
        <div className="col-lg-12">
          <MatchLiklihoodCards
            likliHoodChanged={likliHoodChanged}
            likliHoodsCount={likliHoodsCount}
          />
        </div>

        {/* Enter Customer name card code start */}
        {
          pristine
          &&
          <div className="col-lg-12 mt-2">
            <div className="d-flex align-items-center justify-content-center">
              <div className="card w-100">
                <div className="py-8 text-center mx-auto mw-20">
                  <img src={require("src/assets/images/placeholder-illustration.svg").default}
                       alt="" />
                  <p className="mt-8 color-monoNormal">
                    Enter customer name to see screening results
                  </p>
                </div>
              </div>
            </div>
          </div>
        }
        {/* Enter Customer name card code End */}
        <div data-testid={isScreening ? 'loading' : 'loaded' }></div>
        {
          !pristine
          &&
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
            isScreening={isScreening}
            sortingChanged={sortingChanged}
            sortBy={sortBy}
          />
        }
      </div>
    </>
  );
};

export default IndividualLightScreeningPage;

