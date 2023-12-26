import React, {FormEvent, useState} from 'react';
import chevDownIcon from 'src/assets/images/icons/chevron-down.svg'

interface Props {
    screen: (searchParams: { formData: FormData, fileUploadProgressHandler: (progress: number) => void }) => void
}

const BatchSearchForm: (props: Props) => JSX.Element = (props: Props) => {
    const defaultSearchParams = {
        fileName: '',
        file: null,
        customerType: 'Individual'
    }
    const [searchParameters, setSearchParameters] = useState<{ customerType: string, file: File | null, fileName: string }>({...defaultSearchParams})
    const [fileUploadProgress, setFileUploadProgress] = useState(0)
    const [isContinueMonitoring, setContinueMonitoring] = useState(false)

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
        if (!searchParameters.file || !searchParameters.customerType) {
            valid = false;
        }
        /*******************************/
        if (valid) {
            let formData = new FormData()

            formData.append("file", searchParameters.file!)
            formData.append("customerType", searchParameters.customerType)
            formData.append("monitoring", isContinueMonitoring ? 'Daily' : 'Never ')
            props.screen({
                formData,
                fileUploadProgressHandler: (progress: number) => {
                    setFileUploadProgress(progress)
                }
            })
        }
    }

    const clear = () => {
        setSearchParameters({...defaultSearchParams})
    }

    return (
        <div className="card" data-testid='batch-upload-form'>
            <form onSubmit={screen}>
                <div className="d-flex gap-3 align-items-end flex-wrap">
                    <div className='flex-grow-1 position-relative upload-file'>
                        <label htmlFor="fileForUpload" className="form-label">CSV File*</label>
                        <input
                            name='file_input_disabled'
                            type="text"
                            value={searchParameters.fileName}
                            id="fileForUpload"
                            placeholder='Select file'
                            className='form-control'
                            disabled={true}
                        />
                        <input
                            name='file_input'
                            type="file"
                            accept=".csv,.xlx"
                            onChange={(e) => {
                                if (e.target && e.target.files && e.target.files.length) {
                                    setSearchParameters({
                                        ...searchParameters,
                                        file: e.target.files[0],
                                        fileName: e.target.files[0].name
                                    })
                                }
                            }}
                            className="form-control"
                        />
                        <button
                            name='file_upload_btn'
                            type='button'
                            className="button btn-with-icon grey-btn"
                        >
                            <div>
                                <img
                                    src={require('src/assets/images/icons/browse-icon.svg').default}
                                    alt=""
                                />
                                Browse
                            </div>
                        </button>
                        {/* 'visible' and 'invisible' for toggle progressbar */}
                        <div className={`progress ${!fileUploadProgress || fileUploadProgress === 100 ? 'invisible' : ''}`}>
                            <div
                                className="progress-bar bg-green"
                                role="progressbar"
                                style={{width: `${fileUploadProgress}%`}}
                            />
                        </div>
                    </div>
                    <div className='flex-grow-1 '>
                        <label className="form-label">Customer Type*</label>
                        <select
                            name='customer_type_select'
                            className="form-control"
                            style={{backgroundImage: `url(${chevDownIcon})`}}
                            value={searchParameters.customerType}
                            onChange={(e) => {
                                setSearchParameters({...searchParameters, customerType: e.target.value})
                            }}
                        >
                            <option disabled>Select customer type</option>
                            <option value='Business'>Businesses</option>
                            <option value='Individual'>Individuals</option>
                        </select>
                    </div>
                    <div className='button-group text-right'>
                        <button
                          name='clear-form-btn'
                            className='button btn-ghost'
                            onClick={clear}
                            type='button'
                        >
                            Clear
                        </button>
                        <button
                          name='submit-form-btn'
                            className='button btn-with-icon'
                            onClick={screen}
                            type='submit'
                        >
                            <img src={require('src/assets/images/icons/screen-icon.svg').default}
                                 alt=""/> Screen
                        </button>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="custom-checkbox">
                        <input
                            type="checkbox"
                            id="monitoring"
                            checked={isContinueMonitoring}
                            onChange={() => {
                            setContinueMonitoring(!isContinueMonitoring)
                            }}
                        />
                        <label htmlFor="monitoring">Continue Monitoring</label>
                    </div>
                </div>
                </form>
        </div>
    );
};


export default BatchSearchForm;
