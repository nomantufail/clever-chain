import React, {useEffect, useRef, useState} from 'react';
import {Link, useParams} from "react-router-dom";
import JobEntitiesGrid from "src/components/batch-screening/JobEntitiesGrid";
import { IJobEntitiesFilters, IJobEntity } from "src/types";
import * as screeningService from "src/services/screening.service";
import * as paginationService from "src/services/pagination.service";
import * as notify from "src/services/notification.service";


const BatchJobEntitiesPage: (props: any) => JSX.Element = () => {
    const {jobId} = useParams();

    const [totalPages, setTotalPages] = useState<number>(1);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [nextPage, setNextPage] = useState<string>('');
    const [pageStates, setPageStates] = useState<string[]>(['']);
    const [currentRecordsPerPage, setCurrentRecordsPerPage] = useState<number>(10);
    const [totalRecordsAvailable, setTotalRecordsAvailable] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [pristine, setPristine] = useState<boolean>(true);
    const [jobEntities, setJobEntities] = useState<IJobEntity[]>([]);
    const [jobTitle, setJobTitle] = useState<string>('');
    const [filters, setFilters] = useState<IJobEntitiesFilters>();
    const [filtersData, setFiltersData] = useState({
        categories: [],
        databases: []
    });

    /**
     * This function will fetch the job entities from the backend api
     * with the given search parameters
     */
    const getJobEntities = () => {
        setIsLoading(true);
        screeningService.getJobEntities(
          jobId,
          {...filters},
          nextPage,
          currentRecordsPerPage,
        )
          // @ts-ignore
          .then((response) => {
              const data = response.data.data;
              setJobEntities(data.results)
              setJobTitle(data.jobTitle)
              setTotalPages(data.paging.totalPages)
              setPageStates([ ...pageStates, data.paging.nextPage ])
              setNextPage(data.paging.nextPage || '')
              setTotalRecordsAvailable(data.paging.totalRecordsAvailable)
              setIsLoading(false);
              setFiltersData(data.filtersData);
          })
          .catch((err: any) => {
              if (!err.response.handled) {
                  if (err.response && err.response.data && err.response.data.error.message)
                      notify.error(err.response.data.error.message);
              }
              setJobEntities([])
              setTotalPages(0)
              setNextPage('')
              setTotalRecordsAvailable(0)
              setIsLoading(false);
              setJobTitle('n/a')
          })
          .finally(() => {
              setIsLoading(false)
          })
    }

    const currentPageChanged = async (pageNumber: number) => {
        const {nextPage, computedPageStates } = paginationService.computeNextPage(currentPage, pageNumber, pageStates)
        setNextPage(nextPage);
        setPageStates(computedPageStates)
        setCurrentPage(pageNumber)
    }
    const setRecordsPerPage = async (recordsCount: number) => {
        removePages();
        setCurrentRecordsPerPage(recordsCount)
    }
    const filtersChanged = async (filters: IJobEntitiesFilters) => {
        removePages();
        setFilters(filters)
    }

    // @ts-ignore
    const sortingChanged = async (sort: string) => {
        removePages();
        // setSortBy(sort);
    };

    useEffect(() => {
        getJobEntities();
    }, [filters, currentPage, currentRecordsPerPage, pristine])

    const removePages = () => {
        setPageStates([""]);
        setNextPage("");
        setCurrentPage(1);
    };

    return (
        <div>
            <div className="row">

                <div className="col-lg-12">
                    <div className="card-title d-flex justify-content-between align-items-center">
                        <h4 className='color-monoIntense fw-medium job-title'>
                            <Link to="/batch-screening">
                                <button className='back-btn'>
                                    <img
                                        src={require('src/assets/images/icons/back-arrow.svg').default} alt=""
                                    />
                                </button>
                            </Link>
                            {jobTitle}
                        </h4>
                        <button className="button btn-with-icon md">
                            <img
                                src={require('src/assets/images/icons/download-icon.svg').default} alt=""
                            />
                            Export
                        </button>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="card p-0">
                        <JobEntitiesGrid
                            jobId={jobId!}
                            jobEntities={jobEntities}
                            fetchPage={currentPageChanged}
                            currentPage={currentPage}
                            currentRecordsPerPage={currentRecordsPerPage}
                            setRecordsPerPage={setRecordsPerPage}
                            totalRecordsAvailable={totalRecordsAvailable}
                            totalPages={totalPages}
                            filtersData={filtersData}
                            filtersChanged={filtersChanged}
                            isLoading={isLoading}
                        />
                    </div>
                </div>
            </div>

        </div>
    );
};

export default BatchJobEntitiesPage;
