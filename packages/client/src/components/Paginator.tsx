import React from 'react';
import chevDownIcon from "../assets/images/icons/chevron-down.svg";

interface IProps {
    fetchPage: (pageNumber: number) => void
    setRecordsPerPage: (recordsCount: number) => void
    currentPage: number
    totalPages: number
    currentRecordsCount: number
    totalRecordsAvailable: number
    currentRecordsPerPage: number
}

// @ts-ignore
const Paginator: (props: IProps) => JSX.Element = (
    {
        fetchPage,
        setRecordsPerPage,
        currentPage,
        totalPages,
        currentRecordsCount,
        totalRecordsAvailable,
        currentRecordsPerPage
    }: IProps) => {
    return (
        <>
            <div
                className='pagination table-listing d-flex justify-content-between align-items-center mt-16 p-4'
                data-testid='paginator-container'
            >
                <div>
                    <select
                        value={currentRecordsPerPage}
                        name='records-per-page-select'
                        className='form-control d-inline-block'
                        style={{backgroundImage: `url(${chevDownIcon})`}}
                        onChange={(e) => {
                            setRecordsPerPage(+e.target.value)
                        }}
                    >
                        <option>10</option>
                        <option>15</option>
                        <option>20</option>
                    </select>
                    <span> Matches per page</span>
                </div>
                <div>
                    <span className='current-records-count'>{currentRecordsCount}</span> of <span
                    className='total-available-records-count'>{totalRecordsAvailable}</span> Matches
                </div>
                <div className="d-flex align-items-center gap-2">
                    <input
                        className='form-control'
                        name='current-page-input'
                        type="number"
                        disabled
                        value={currentPage}
                        onChange={(e) => {
                            fetchPage(+e.target.value)
                        }}
                    />
                    <span> of {totalPages}</span>
                    <div className="pagination-btns">
                        <button
                          className={currentPage <= 1 ? 'disabled' : ''}
                          disabled={currentPage == 1}
                            name='backward-btn'
                            onClick={() => {
                                (currentPage > 1) && fetchPage(currentPage - 1)
                            }}
                        >
                            <img src={require('src/assets/images/icons/prev-icon.svg').default} alt=""/>
                        </button>
                        <button
                            className={currentPage >= totalPages ? 'disabled' : ''}
                            name='forward-btn'
                            disabled={currentPage >= totalPages}
                            onClick={() => {
                                fetchPage(currentPage + 1)
                            }}
                        >
                            <img src={require('src/assets/images/icons/next-icon.svg').default} alt=""/>
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Paginator;
