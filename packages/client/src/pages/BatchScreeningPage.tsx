import React, { useEffect, useRef, useState } from "react";
import BatchSearchForm from "../components/batch-screening/BatchSearchForm";
import { IJobsFilters, IJob } from "../types";
import * as screeningService from "../services/screening.service";
import * as notificationService from "../services/notification.service";
import JobsGrid from "../components/batch-screening/JobsGrid";
import { EntityType, JobStatus } from "src/enums";
import * as notify from "src/services/notification.service";
import * as paginationService from "src/services/pagination.service";


const BatchScreeningPage: React.FC = () => {
  const fileUploadProgressTracker = useRef<((progress: number) => void)>();
  const [pristine, setPristine] = useState<boolean>(true);
  const [jobs, setJobs] = useState<IJob[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [nextPage, setNextPage] = useState<string>("");
  const [pageStates, setPageStates] = useState<string[]>([""]);
  const [currentRecordsPerPage, setCurrentRecordsPerPage] = useState<number>(10);
  const [totalRecordsAvailable, setTotalRecordsAvailable] = useState<number>(0);
  const [isScreening, setIsScreening] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [filters, setFilters] = useState<IJobsFilters>({ startedDate: "", customerType: "" });
  const [sortBy, setSortBy] = useState<string>("match|desc");
  const [searchParameters, setSearchParameters] = useState<{ formData: FormData }>();
  const [screeningComplete, setScreeningComplete] = useState(false);
  let searchParamsChanged = useRef<any>();
  let interval = useRef<any>();
  let currentPageRef = useRef<number>(1);
  let jobsRef = useRef<IJob[]>([]);
  const [isErrorLoadingJobs, setIsErrorLoadingJobs] = useState<boolean>(false);

  currentPageRef.current = currentPage;
  jobsRef.current = jobs;

  const refreshJobs = () => {
    if (currentPageRef.current === 1 && jobsRef.current.some((job) => job.job_status === JobStatus.Pending || job.job_status === JobStatus.InProgress)) {
      fetchJobs(true, false);
    }
  }

  const downloadCsv = async (fileName: string) => {
    window.open(`${process.env.REACT_APP_BASE_URL}${fileName}`, "_blank", "noopener,noreferrer");
  };

  const startScreening = () => {
    setIsScreening(true);
    screeningService.startBatchScreening(
      searchParameters!.formData,
      fileUploadProgressTracker.current!
    )
      // @ts-ignore
      .then((result) => {
        notificationService.success("File uploaded successfully. System will start processing it soon.");
        fetchJobs(true);
      })
      .catch(err => {
        if (!err.response.handled) {
          if (err.response.status === 400) {
            void downloadCsv(err.response.data.error.errorMessages[0].value);
            notificationService.error(err.response.data.error.errorMessages[0].message);
          } else {
            notificationService.error(err.message);
          }

        }
      })
      .finally(() => {
        setIsScreening(false);
      });
  };

  const fetchJobs = (firstPage = false, showLoader = true) => {
    showLoader && setIsLoading(true);
    screeningService.fetchJobs(
      { ...filters },
      firstPage ? '' : nextPage,
      currentRecordsPerPage,
      sortBy
    )
      // @ts-ignore
      .then((response) => {
        const data = response.data.data;
        setJobs(data.results);
        setTotalPages(data.paging.totalPages);
        setPageStates([...pageStates, data.paging.nextPage]);
        setNextPage(data.paging.nextPage || "");
        setTotalRecordsAvailable(data.paging.totalRecordsAvailable);
        setIsLoading(false);
      })
      .catch((err: any) => {
        if (!err.response.handled) {
          if (err.response && err.response.data && err.response.data.error.message)
            notify.error(err.response.data.error.message);
        }
        setIsErrorLoadingJobs(true);
        setJobs([]);
        setTotalPages(0);
        setNextPage("");
        setTotalRecordsAvailable(0);
        setIsLoading(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const searchParametersChanged = async (params: { formData: FormData, fileUploadProgressHandler: (progress: number) => void }) => {
    setPristine(false);
    searchParamsChanged.current = true;
    fileUploadProgressTracker.current = params.fileUploadProgressHandler;
    setSearchParameters({ formData: params.formData });
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
  const filtersChanged = async (filters: IJobsFilters) => {
    removePages();
    setFilters(filters);
  };
  const sortingChanged = async () => {};

  useEffect(() => {
    interval.current = setInterval(refreshJobs, 3000);
    if (!pristine) {
      startScreening();
    }
    return () => {
      clearInterval(interval.current);
    }
  }, [searchParameters, pristine]);

  const removePages = () => {
    setPageStates([""]);
    setNextPage("");
    setCurrentPage(1);
  };

  useEffect(() => {
    fetchJobs();
  }, [filters, currentPage, currentRecordsPerPage, sortBy]);

  return (
    <div>
      <div className="row">
        <div className="col-lg-12">
          <div className="card-title">
            <h4>UPLOAD FILES</h4>
          </div>
        </div>
        <div className="col-lg-12">
          <BatchSearchForm screen={searchParametersChanged} />
        </div>

      </div>

      <div className="row">
        <div className="col-lg-12 mt-10">
          <div className="card-title">
            <h4>BATCH JOBS</h4>
          </div>
        </div>
        <div className="col-lg-12">
          <div className={`overlay-loader ${isLoading ? "active" : ""}`}>
            <div className={`loader text-center`}>
              <img src={require("src/assets/images/logo-icon.svg").default} alt="" />
              <p className="mt-6">Screening...</p>
            </div>
          </div>
          {
            !isErrorLoadingJobs ?
              <div className="card" data-testid={isLoading ? 'loading' : 'loaded' }>
                <JobsGrid
                  jobs={jobs}
                  fetchPage={currentPageChanged}
                  currentPage={currentPage}
                  currentRecordsPerPage={currentRecordsPerPage}
                  setRecordsPerPage={setRecordsPerPage}
                  totalRecordsAvailable={totalRecordsAvailable}
                  totalPages={totalPages}
                  filtersChanged={filtersChanged}
                  isLoading={isLoading}
                  sortingChanged={sortingChanged}
                  sortBy={sortBy}
                />
              </div> : <div className="card">Something went wrong</div>
          }
        </div>
      </div>
    </div>
  );
};

export default BatchScreeningPage;
