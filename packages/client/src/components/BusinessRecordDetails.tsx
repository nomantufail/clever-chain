import React, {useEffect, useState} from 'react';
import IBusinessRecordDetails from "src/types/IBusinessRecordDetails";

interface IProps {
    recordDetails: IBusinessRecordDetails,
}

// @ts-ignore
const BusinessRecordDetails: (props: IProps) => JSX.Element = ({recordDetails}: IProps) => {
    useEffect(() => {}, [])

    return (
        <div className='border-bottom-3' data-testid='business-record-details'>
            <div className='result-summary d-flex gap-4 p-4'>
                <div className='text-right'>
                    <p className='emptySpace'>Personal Info</p>
                    <p className='fs-12 color-monoNormal'>Name</p>
                    <p className='fs-12 color-monoNormal'>Trading Name</p>
                    <p className='fs-12 color-monoNormal'>EIN</p>
                    <p className='fs-12 color-monoNormal'>Address Line 1</p>
                    <p className='fs-12 color-monoNormal'>City</p>
                    <p className='fs-12 color-monoNormal'>Country</p>

                </div>
                <div className=''>
                    <p className='emptySpace'>Tag</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.registeredName?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.registeredName.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.tradingName?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.tradingName?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.ein?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.ein?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.addressLine1?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.addressLine1?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.city?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.city?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.country?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.country?.matchCriteria || 'Not Available'}</p>
                </div>
                <div className=''>
                    <p className='color-monoNormal'>Internal Info</p>
                    <p>{recordDetails.registeredName?.internalInfo}</p>
                    <p>{recordDetails.tradingName?.internalInfo}</p>
                    <p>{recordDetails.ein?.internalInfo}</p>
                    <p>{recordDetails.addressLine1?.internalInfo}</p>
                    <p>{recordDetails.city?.internalInfo}</p>
                    <p><img src={require('../assets/images/icons/flag.svg').default} alt=""/> {recordDetails.country?.internalInfo}</p>
                </div>
                <div className=''>
                    <p className='color-monoNormal'>Matched Entity</p>
                    <p>{recordDetails.registeredName?.matchedEntity}</p>
                    <p>{recordDetails.tradingName?.matchedEntity}</p>
                    <p>{recordDetails.ein?.matchedEntity}</p>
                    <p>{recordDetails.addressLine1?.matchedEntity}</p>
                    <p>{recordDetails.city?.matchedEntity}</p>
                    <p><img src={require('../assets/images/icons/flag.svg').default} alt=""/> {recordDetails.country?.matchedEntity}</p>
                </div>
            </div>
        </div>
    )
}

export default BusinessRecordDetails;
