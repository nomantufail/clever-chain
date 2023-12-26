import React, { useEffect, useRef, useState } from "react";
import chevDownIcon from "src/assets/images/icons/chevron-down.svg";
import Paginator from "src/components/Paginator";
import { IJobEntitiesFilters, IJobEntity, IScreeningResultsFilters } from "src/types";
import { Link } from "react-router-dom";
import { LikliHood } from "src/enums";

interface IProps {
  jobId: string;
  jobEntities: IJobEntity[];
  currentPage: number;
  filtersData: { databases: string[], categories: string[] }
  filtersChanged: (searchParams: any) => void;
  fetchPage: (pageNumber: number) => void;
  setRecordsPerPage: (recordsCount: number) => void;
  currentRecordsPerPage: number;
  totalRecordsAvailable: number;
  totalPages: number;
  isLoading: boolean;
}

const JobEntitiesGrid: (props: IProps) => JSX.Element = (props: IProps) => {
  const isInitialMount = useRef(true);
  const [filters, setFilters] = useState<IJobEntitiesFilters>({
    database: "",
    category: "",
    match: ""
  });

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      props.filtersChanged(filters);
    }
  }, [filters]);

  return (
    <>
      <div className="p-4 border-bottom job-entities-grid">
        <form>
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-3 flex-wrap">
              <div className="select-with-left-icon">
                <select
                  name="matches-filter"
                  className="form-control"
                  style={{ backgroundImage: `url(${chevDownIcon})` }}
                  value={filters.match}
                  onChange={(e) => {
                    setFilters({ ...filters, match: e.target.value });
                  }}
                >
                  <option value={LikliHood.All}>All Matches</option>
                  <option value={LikliHood.ExactMatch}>Exact</option>
                  <option value={LikliHood.VeryHigh}>Very High</option>
                  <option value={LikliHood.High}>High</option>
                  <option value={LikliHood.Medium}>Medium</option>
                  <option value={LikliHood.Low}>Low</option>
                  <option value={LikliHood.VeryLow}>Very Low</option>
                </select>
                <img src={require("src/assets/images/icons/match-icon.svg").default} alt="" />
              </div>
              <div className="select-with-left-icon">
                <select
                  name='database-filter'
                  className="form-control"
                  style={{ backgroundImage: `url(${chevDownIcon})` }}
                  onChange={(e) => {
                    setFilters({ ...filters, database: e.target.value });
                  }}
                >
                  <option value="">All Databases</option>
                  {
                    props.filtersData.databases.map((database) => {
                      return <option key={database} value={database}>{database}</option>;
                    })
                  }
                </select>
                <img src={require("src/assets/images/icons/db-icon.svg").default} alt="" />
              </div>
              <div className="select-with-left-icon">
                <select
                  name='category-filter'
                  className="form-control"
                  style={{ backgroundImage: `url(${chevDownIcon})` }}
                  value={filters.category}
                  onChange={(e) => {
                    setFilters({ ...filters, category: e.target.value });
                  }}
                >
                  <option value="">All Categories</option>
                  {
                    props.filtersData.categories.map((category) => {
                      return <option key={category} value={category}>{category}</option>;
                    })
                  }
                </select>
                <img
                  src={require("src/assets/images/icons/categories-icon.svg").default}
                  alt=""
                />
              </div>

            </div>

          </div>
        </form>
      </div>
      <div className="batchJobsListing job-entities mt-2  px-4">
        {
          props.jobEntities.map((entity) => {
            return (
              <Link to={`/batch-screening/job-entity-matches/${props.jobId}/${entity.id}`} key={entity.id}>
                <li className="d-flex flex-wrap justify-content-between p-4 hvg-bg" data-testid='job-entity-list-item'>
                  <div className="d-flex ">
                    <div className="company">
                      <h6>{entity.name}</h6>
                    </div>
                    <div className="d-flex flex-wrap gap-8  right-fields">
                      <div className="batch-job-col">
                        <span>Total Matches</span>
                        <p>{entity.total_matches}</p>
                      </div>
                      <div className="batch-job-col">
                        <span>Highest Likelihood</span>
                        {
                          entity.match &&
                          <p className={"badge badge-pill text-white py-1 px-3 badge-color-" + entity.match.toLowerCase().replace(/\s/g, '-')}>{entity.match}</p>
                        }
                        {
                          !entity.match &&
                          <p className=""> - </p>
                        }
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center">
                    <img src={require("src/assets/images/icons/chevron-right.svg").default} alt="" />
                  </div>
                </li>
              </Link>
            );
          })
        }
      </div>
      <p></p>


      <Paginator
          fetchPage={props.fetchPage}
          setRecordsPerPage={props.setRecordsPerPage}
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          currentRecordsCount={props.jobEntities.length}
          currentRecordsPerPage={props.currentRecordsPerPage}
          totalRecordsAvailable={props.totalRecordsAvailable}
      />
    </>
  );
};

export default JobEntitiesGrid;
