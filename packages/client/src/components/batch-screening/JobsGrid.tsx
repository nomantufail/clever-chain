import React, { useEffect, useRef, useState } from "react";
import chevDownIcon from "src/assets/images/icons/chevron-down.svg";
import { IJob, IJobsFilters } from "src/types";
import { Link } from "react-router-dom";
import { JobStatus } from "src/enums";
import moment from "moment";
import Paginator from "src/components/Paginator";

interface IProps {
  jobs: IJob[];
  currentPage: number;
  filtersChanged: (searchParams: any) => void;
  sortingChanged: (sortBy: string) => void;
  fetchPage: (pageNumber: number) => void;
  setRecordsPerPage: (recordsCount: number) => void;
  currentRecordsPerPage: number;
  totalRecordsAvailable: number;
  totalPages: number;
  isLoading: boolean;
  sortBy: string;
}

const JobsGrid: (props: IProps) => JSX.Element = (props: IProps) => {
  const isInitialMount = useRef(true);
  const [filters, setFilters] = useState<IJobsFilters>({
    startedDate: "",
    customerType: ""
  });

  const icons: { [key: string]: any } = {
    [JobStatus.InProgress]: require("src/assets/images/icons/inprogress.svg").default,
    [JobStatus.Complete]: require("src/assets/images/icons/complete.svg").default,
    [JobStatus.Error]: require("src/assets/images/icons/error.svg").default
  };

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      props.filtersChanged(filters);
    }
  }, [filters]);

  return (
    <>
      <div data-testid="jobs-grid">
        <form>
          <div className="d-flex justify-content-between">
            <div className="d-flex gap-3 flex-wrap">
              <div className="select-with-left-icon">
                <select
                  className="form-control"
                  style={{ backgroundImage: `url(${chevDownIcon})` }}
                  value={filters.startedDate}
                  onChange={(e) => {
                    setFilters({ ...filters, startedDate: e.target.value });
                  }}
                >
                  <option value={""}>All Jobs</option>
                  <option value={moment().subtract(1, "month").format("YYYY-MM-DD")}>1 Month</option>
                  <option value={moment().subtract(3, "months").format("YYYY-MM-DD")}>3 Months</option>
                  <option value={moment().subtract(12, "months").format("YYYY-MM-DD")}>12 Months</option>
                  <option value={moment().subtract(3, "years").format("YYYY-MM-DD")}>3 Years</option>
                </select>
                <img src={require("src/assets/images/icons/allFiles-icon.svg").default} alt="" />
              </div>
              <div className="select-with-left-icon">
                <select
                  name="allCustomers"
                  className="form-control"
                  style={{ backgroundImage: `url(${chevDownIcon})` }}
                  value={filters.customerType}
                  onChange={(e) => {
                    setFilters({ ...filters, customerType: e.target.value });
                  }}
                >
                  <option value={""}>All Customers</option>
                  <option value={"Business"}>Businesses</option>
                  <option value={"Individual"}>Individuals</option>
                </select>
                <img src={require("src/assets/images/icons/customers-icon.svg").default} alt="" />
              </div>
            </div>
          </div>
        </form>

        <div className="batchJobsListing mt-4">
          {props.jobs.map((job) => {
            return (
              <Link
                key={job.id}
                to={`/batch-screening/job-entities/${job.id}`}
                style={{ pointerEvents:  job.job_status === JobStatus.Complete ? "auto" : "none" }}
              >
                <li className="d-flex flex-nowrap justify-content-between p-4 hvg-bg" data-testid='job-item'>
                  <div>
                    <h6>{job.job_title}</h6>
                    <span
                      className={`job-status ${job.job_status.toLowerCase()}`}
                    >
                    <img
                      src={icons[job.job_status]}
                      alt=""
                    /> {job.job_status.replace(/([a-z])([A-Z])/g, "$1 $2")}</span>
                  </div>
                  <div className="d-flex justify-content-between flex-nowrap gap-8  right-fields">
                    <div className="batch-job-col">
                      <span>Customer Type</span>
                      <p>{job.customer_type}</p>
                    </div>
                    <div className="batch-job-col">
                      <span>Records</span>
                      <p>{[JobStatus.Error, JobStatus.InProgress, JobStatus.Pending].includes(job.job_status as JobStatus) ? "-" : job.total_input_records}</p>
                    </div>
                    <div className="batch-job-col">
                      <span>Matched Customers</span>
                      <p>{[JobStatus.Error, JobStatus.InProgress, JobStatus.Pending].includes(job.job_status as JobStatus) ? "-" : job.matched_customers}</p>
                    </div>
                    <div className="batch-job-col">
                      <span>Potential Matches</span>
                      <p>{[JobStatus.Error, JobStatus.InProgress, JobStatus.Pending].includes(job.job_status as JobStatus) ? "-" : job.potential_matches}</p>
                    </div>
                    <div className="batch-job-col">
                      <span>No Matches</span>
                      <p>{[JobStatus.Error, JobStatus.InProgress, JobStatus.Pending].includes(job.job_status as JobStatus) ? "-" : job.no_matches}</p>
                    </div>
                    <div className="batch-job-col">
                      <span>Completed Time</span>
                      <p>{[JobStatus.Error, JobStatus.InProgress, JobStatus.Pending].includes(job.job_status as JobStatus) || !job.completed_time ? "-" : moment(job.completed_time, "HH:mm:SS").format("h:mm A")}</p>
                    </div>
                    <div className="batch-job-col">
                      <span>Started date</span>
                      <p>{[JobStatus.Error, JobStatus.InProgress, JobStatus.Pending].includes(job.job_status as JobStatus) ? "-" : moment(job.started_at).format("MMM Do YYYY")}</p>
                    </div>
                  </div>
                </li>
              </Link>
            );
          })}
        </div>

        <Paginator
          fetchPage={props.fetchPage}
          setRecordsPerPage={props.setRecordsPerPage}
          currentPage={props.currentPage}
          totalPages={props.totalPages}
          currentRecordsCount={props.jobs.length}
          currentRecordsPerPage={props.currentRecordsPerPage}
          totalRecordsAvailable={props.totalRecordsAvailable}
        />
      </div>
    </>
  );
};

export default JobsGrid;
