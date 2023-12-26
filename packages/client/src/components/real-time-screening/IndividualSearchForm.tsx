import React, {FormEvent, useEffect, useMemo, useState} from 'react';
import Select, {SingleValue} from 'react-select'
import countryList from 'react-select-country-list'
import {IIndividualScreeningSearchParams} from "src/types";

interface Props {
    screen: (searchParams: IIndividualScreeningSearchParams) => void
    screeningComplete: boolean
}

const IndividualSearchForm: (props: Props) => JSX.Element = (props: Props) => {
    const defaultSearchParams: IIndividualScreeningSearchParams = {
        firstName: '',
        middleName: '',
        lastName: '',
        dateOfBirth: '',
        city: '',
        county: '',
        country: '',
        addressLine2: '',
        addressLine1: '',
        postalCode: ''
    }
    const [isCollapsed, setIsCollapsed] = useState(false)
    const [searchParameters, setSearchParameters] = useState<IIndividualScreeningSearchParams>({...defaultSearchParams})
    const [countrySelectValue, setCountrySelectValue] = useState('')
    const [monitoring, setContinueMonitoring] = useState(false)

    const options: any = useMemo(() => countryList().getData(), [])

    /**
     * This function performs the basic validation before screening
     * @param e
     */
    const screen = (e: FormEvent) => {
        e.preventDefault();
        let valid = true;
        /**
         * First validate the input
         */
        if (!searchParameters.firstName || !searchParameters.lastName)
            valid = false;
        /*******************************/
        valid && props.screen({...searchParameters, monitoring: monitoring ? 'Daily': 'Never'})
    }

    const clear = () => {
        setSearchParameters({...defaultSearchParams})
    }

    useEffect(() => {
        if (props.screeningComplete) {
            setIsCollapsed(true);
        }
    }, [props.screeningComplete])


    return (
        <div className={`collapsable-form ${!isCollapsed ? "opened" : ""}`}>
            {/* Business Light Screening Page */}
            <div className="col-lg-12 card top-head p-0 overflow-visible">
                <div className="py-4 px-4">
                    <form onSubmit={screen}>
                        <div className="d-flex gap-3 align-items-end flex-wrap ew-cols">
                            <div className='flex-gow-1'>
                                <label className="form-label">First Name*</label>
                                <input
                                    name='first_name'
                                    className='form-control'
                                    type="text"
                                    placeholder='Enter first name'
                                    required
                                    value={searchParameters.firstName}
                                    onChange={
                                        (e) => {
                                            setSearchParameters({...searchParameters, firstName: e.target.value})
                                        }
                                    }
                                />
                            </div>
                            <div className='flex-grow-1'>
                                <label className="form-label">Middle Name</label>
                                <input
                                    name='middle_name'
                                    className='form-control'
                                    type="text"
                                    placeholder='Enter middle name'
                                    value={searchParameters.middleName}
                                    onChange={
                                        (e) => {
                                            setSearchParameters({...searchParameters, middleName: e.target.value})
                                        }
                                    }
                                />
                            </div>
                            <div className='flex-grow-1'>
                                <label className="form-label">Last Name*</label>
                                <input
                                    name='last_name'
                                    className='form-control'
                                    type="text"
                                    placeholder='Enter last name'
                                    required
                                    value={searchParameters.lastName}
                                    onChange={
                                        (e) => {
                                            setSearchParameters({...searchParameters, lastName: e.target.value})
                                        }
                                    }
                                />
                            </div>
                            <div className='flex-grow-1'>
                                <label className="form-label">Date of Birth</label>
                                <input
                                    name='date_of_birth'
                                    className='form-control'
                                    type="date"
                                    placeholder='Enter date of birth'
                                    min={'1800-01-01'}
                                    value={searchParameters.dateOfBirth}
                                    onChange={
                                        (e) => {
                                            setSearchParameters({...searchParameters, dateOfBirth: e.target.value})
                                        }
                                    }
                                />
                            </div>
                            <div className='button-group text-right custom-actions flex-shrink-0'>
                                <button
                                    type='button'
                                    className='button btn-ghost'
                                    onClick={clear}
                                >
                                    Clear
                                </button>
                                <button
                                    type='submit'
                                    className='button btn-with-icon'
                                >
                                    <img
                                        src={require('src/assets/images/icons/screen-icon.svg').default}
                                        alt=""
                                    />
                                    Screen
                                </button>
                            </div>
                        </div>
                        {!isCollapsed && (
                            <div
                                className='additional-fields mt-8'
                                data-testid='additional-fields'
                            >
                                <div className='d-flex gap-3'>
                                    <div className='flex-fill'>
                                        <label className="form-label">Address Line 1</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name='address_line_1'
                                            placeholder='Enter address line 1'
                                            value={searchParameters.addressLine1}
                                            onChange={
                                                (e) => {
                                                    setSearchParameters({
                                                        ...searchParameters,
                                                        addressLine1: e.target.value
                                                    })
                                                }
                                            }
                                        />
                                    </div>
                                    <div className='flex-fill'>
                                        <label className="form-label">Address Line 2</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name='address_line_2'
                                            placeholder='Enter address line 2'
                                            value={searchParameters.addressLine2}
                                            onChange={
                                                (e) => {
                                                    setSearchParameters({
                                                        ...searchParameters,
                                                        addressLine2: e.target.value
                                                    })
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='d-flex flex-wrap gap-3 my-8 ew-cols'>
                                    <div className='flex-fill'>
                                        <label className="form-label">City</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name='city'
                                            placeholder='Enter city'
                                            value={searchParameters.city}
                                            onChange={
                                                (e) => {
                                                    setSearchParameters({...searchParameters, city: e.target.value})
                                                }
                                            }
                                        />
                                    </div>
                                    <div className='flex-fill'>
                                        <label className="form-label">County</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name='county'
                                            placeholder='Enter county'
                                            value={searchParameters.county}
                                            onChange={
                                                (e) => {
                                                    setSearchParameters({...searchParameters, county: e.target.value})
                                                }
                                            }
                                        />
                                    </div>
                                    <div className='flex-fill'>
                                        <label className="form-label">Postal Code</label>
                                        <input
                                            className='form-control'
                                            type="text"
                                            name='postal_code'
                                            placeholder='Enter postal code'
                                            value={searchParameters.postalCode}
                                            onChange={
                                                (e) => {
                                                    setSearchParameters({
                                                        ...searchParameters,
                                                        postalCode: e.target.value
                                                    })
                                                }
                                            }
                                        />
                                    </div>
                                    <div className='flex-fill'>
                                        <label className="form-label">Country</label>
                                        <Select
                                            className="dynamic-countries"
                                            name='country'
                                            options={options}
                                            value={countrySelectValue}
                                            onChange={
                                                (value: SingleValue<string>) => {
                                                    setCountrySelectValue(value as any)
                                                    setSearchParameters({
                                                        ...searchParameters,
                                                        country: value
                                                    })
                                                }
                                            }
                                        />
                                    </div>
                                </div>
                                <div className='d-flex flex-wrap justify-content-between align-items-center'>
                                    <div className="mt-4">
                                        <div className="custom-checkbox">
                                            <input
                                                type="checkbox"
                                                id="monitoring"
                                                checked={monitoring}
                                                onChange={() => {
                                                    setContinueMonitoring(!monitoring)
                                                }}
                                            />
                                            <label htmlFor="monitoring">Continue Monitoring</label>
                                        </div>
                                    </div>
                                    <div className='button-group'>
                                        <button
                                            type='button'
                                            name='clearBtn'
                                            className='button btn-ghost'
                                            onClick={clear}
                                        >
                                            Clear
                                        </button>
                                        <button
                                        type='submit'
                                        className='button btn-with-icon'
                                    >
                                        <img src={require('src/assets/images/icons/screen-icon.svg').default} alt=""/>
                                        Screen
                                    </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </form>
                </div>
                <div
                    data-testid='collapse-button'
                    className='d-block text-center cursor-pointer collapse-icon border-top py-2'
                    onClick={() => setIsCollapsed(!isCollapsed)}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" clipRule="evenodd"
                              d="M7.29303 9.29259C7.48056 9.10512 7.73487 8.99981 8.00003 8.99981C8.26519 8.99981 8.5195 9.10512 8.70703 9.29259L12 12.5856L15.293 9.29259C15.3853 9.19708 15.4956 9.1209 15.6176 9.06849C15.7396 9.01608 15.8709 8.9885 16.0036 8.98734C16.1364 8.98619 16.2681 9.01149 16.391 9.06177C16.5139 9.11205 16.6255 9.18631 16.7194 9.2802C16.8133 9.37409 16.8876 9.48574 16.9379 9.60864C16.9881 9.73154 17.0134 9.86321 17.0123 9.99599C17.0111 10.1288 16.9835 10.26 16.9311 10.382C16.8787 10.504 16.8025 10.6143 16.707 10.7066L12.707 14.7066C12.5195 14.8941 12.2652 14.9994 12 14.9994C11.7349 14.9994 11.4806 14.8941 11.293 14.7066L7.29303 10.7066C7.10556 10.5191 7.00024 10.2648 7.00024 9.99959C7.00024 9.73443 7.10556 9.48012 7.29303 9.29259Z"
                              fill="#110133"/>
                    </svg>
                </div>
            </div>
        </div>
    );
};

export default IndividualSearchForm;
