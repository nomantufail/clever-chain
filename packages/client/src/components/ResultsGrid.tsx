import React, {useEffect, useRef, useState} from 'react';
import moment from 'moment'
import chevDownIcon from 'src/assets/images/icons/chevron-down.svg'
import RecordSummaryComponent from "src/components/RecordSummaryComponent";
import ScreeningResultRecord from "./ScreeningResultRecord";
import Paginator from "./Paginator";
import {IScreeningResultsFilters} from "src/types";
import IScreenedResult from '@cc/shared-service/src/server/types/response/partials/IScreenedResult'
import IFiltersData from '@cc/shared-service/src/server/types/response/partials/IFiltersData'
import {LikliHood} from "src/enums";

interface IProps {
    results: IScreenedResult[]
    currentPage: number
    filtersChanged: (searchParams: any) => void
    filtersData: IFiltersData
    sortingChanged: (sortBy: string) => void
    fetchPage: (pageNumber: number) => void
    setRecordsPerPage: (recordsCount: number) => void
    currentRecordsPerPage: number
    totalRecordsAvailable: number
    totalPages: number
    isScreening: boolean
    sortBy: string
}

const ResultsGrid: (props: IProps) => JSX.Element = (props: IProps) => {
    const isInitialMount = useRef(true);
    const [openedRecord, setOpenedRecord] = useState('');
    const [recordSummary, setRecordSummary] = useState('');
    const [filters, setFilters] = useState<IScreeningResultsFilters>({
        database: '',
        category: '',
        subCategory: '',
        selectedLikliHood: LikliHood.All,
        updatedDate: ''
    })

    useEffect(() => {
        if (openedRecord) {
            const record = props.results.find(result => result.id === openedRecord)
            setRecordSummary((record && record.comments) || '');
        } else {
            setRecordSummary('');
        }
    }, [openedRecord]);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
        } else {
            props.filtersChanged(filters)
        }
    }, [filters]);
    return (
        <div className="col-lg-12 mt-3">
            <div className={`overlay-loader ${props.isScreening ? 'active' : ''}`}>
                <div className={`loader text-center`}>
                    <img src={require('src/assets/images/logo-icon.svg').default} alt=""/>
                    <p className='mt-6'>Screening...</p>
                </div>
            </div>
            <div className="card p-0">
                <div className='p-4 border-bottom'>
                    <form data-testid='filters-form'>
                        <div className="d-flex gap-3 justify-content-between">
                            <div className='d-flex gap-3'>
                                <div className='select-with-left-icon'>
                                    <select
                                        name='database-filter'
                                        className="form-control"
                                        style={{backgroundImage: `url(${chevDownIcon})`}}
                                        value={filters.database}
                                        onChange={(e) => {
                                            setFilters({...filters, database: e.target.value})
                                        }}
                                    >
                                        <option value=''>All Databases</option>
                                        {
                                            props.filtersData.databases.map((database) => {
                                                return <option key={database} value={database}>{database}</option>
                                            })
                                        }
                                    </select>
                                    <img src={require('src/assets/images/icons/db-icon.svg').default} alt=""/>
                                </div>
                                <div className='select-with-left-icon'>
                                    <select
                                        name='category-filter'
                                        className="form-control"
                                        style={{backgroundImage: `url(${chevDownIcon})`}}
                                        value={filters.category}
                                        onChange={(e) => {
                                            setFilters({...filters, category: e.target.value})
                                        }}
                                    >
                                        <option value=''>All Categories</option>
                                        {
                                            props.filtersData.categories.map((category) => {
                                                return <option key={category} value={category}>{category}</option>
                                            })
                                        }
                                    </select>
                                    <img src={require('src/assets/images/icons/categories-icon.svg').default} alt=""/>
                                </div>
                                <div className='select-with-left-icon'>
                                    <select
                                        name='subCategory-filter'
                                        className="form-control"
                                        style={{backgroundImage: `url(${chevDownIcon})`}}
                                        value={filters.subCategory}
                                        onChange={(e) => {
                                            setFilters({...filters, subCategory: e.target.value})
                                        }}
                                    >
                                        <option value=''>All Sub-categories</option>
                                        {
                                            props.filtersData.subcategories.map((subcategory) => {
                                                return <option key={subcategory}
                                                               value={subcategory}>{subcategory}</option>
                                            })
                                        }
                                    </select>
                                    <img src={require('src/assets/images/icons/subcats-icon.svg').default} alt=""/>
                                </div>
                                <div className='select-with-left-icon'>
                                    <select
                                      name='updates-filter'
                                      className="form-control"
                                      style={{backgroundImage: `url(${chevDownIcon})`}}
                                      value={filters.updatedDate}
                                      onChange={(e) => {
                                          setFilters({...filters, updatedDate: e.target.value})
                                      }}
                                    >
                                        <option value={''}>All Updates</option>
                                        <option value={moment().subtract(1, 'month').format('YYYY-MM-DD')}>1 Month</option>
                                        <option value={moment().subtract(3, 'months').format('YYYY-MM-DD')}>3 Months</option>
                                        <option value={moment().subtract(12, 'months').format('YYYY-MM-DD')}>12 Months</option>
                                        <option value={moment().subtract(3, 'years').format('YYYY-MM-DD')}>3 Years</option>
                                    </select>
                                    <img src={require('src/assets/images/icons/calender-icon.svg').default} alt=""/>
                                </div>
                            </div>
                            <div className='select-with-left-icon'>
                                <select
                                    className="form-control"
                                    name="sorting-selector"
                                    style={{backgroundImage: `url(${chevDownIcon})`}}
                                    value={props.sortBy}
                                    onChange={e => props.sortingChanged(e.target.value)}
                                >
                                    <option value={'match|desc'}>Highest match</option>
                                    <option value={'match|asc'}>Lowest match</option>
                                </select>
                                <img src={require('src/assets/images/icons/sort-icon.svg').default} alt=""/>
                            </div>
                        </div>
                    </form>
                </div>
                <div className='row m-0'>
                    <div className='col-lg-9 border-right'>
                        <div className='result-list'>
                            <div className="listWrap">
                                <ul className='m-0 tabel-heading'>
                                    <li>
                                        <div className='t-row heading border-bottom'>
                                            <span className='color-monoNormal'>Name</span>
                                            <span className='color-monoNormal'>Match</span>
                                            <span className='color-monoNormal'>Database</span>
                                            <span className='color-monoNormal'>Category</span>
                                            <span className='color-monoNormal'>Sub-category</span>
                                            <span className='color-monoNormal'>Date Updated</span>
                                            <span className='color-monoNormal'/>
                                        </div>
                                    </li>
                                </ul>

                                <div className='tablebody'>
                                    <ul className="">
                                        {props.results.map((record) => {
                                            return (
                                                <ScreeningResultRecord
                                                    key={record.id}
                                                    record={record}
                                                    openedRecord={openedRecord}
                                                    setOpenedRecord={setOpenedRecord}
                                                />
                                            )
                                        })}
                                    </ul>
                                </div>

                            </div>
                        </div>
                        {
                            props.totalRecordsAvailable > 10
                            &&
                            <Paginator
                                fetchPage={props.fetchPage}
                                setRecordsPerPage={props.setRecordsPerPage}
                                currentPage={props.currentPage}
                                totalPages={props.totalPages}
                                currentRecordsCount={props.results.length}
                                currentRecordsPerPage={props.currentRecordsPerPage}
                                totalRecordsAvailable={props.totalRecordsAvailable}
                            />
                        }
                    </div>
                    <div className='col-lg-3 px-0'>
                        <RecordSummaryComponent
                          summary={recordSummary}
                          recordId={openedRecord}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResultsGrid;
