import React, {useEffect, useState} from 'react';
import IScreenedResult from '@cc/shared-service/src/server/types/response/partials/IScreenedResult'
import IIndividualRecordDetails from "src/types/IIndividualRecordDetails";

interface IProps {
    recordDetails: IIndividualRecordDetails,
}

// @ts-ignore
const IndividualRecordDetails: (props: IProps) => JSX.Element = ({recordDetails}: IProps) => {
    useEffect(() => {}, [])

    return (
        <div className='border-bottom-3'>
            <div className='result-summary d-flex gap-4 p-4'>
                <div className='text-right'>
                    <p className='emptySpace'>Personal Info</p>
                    <p className='fs-12 color-monoNormal'>First Name</p>
                    <p className='fs-12 color-monoNormal'>Middle Name</p>
                    <p className='fs-12 color-monoNormal'>Last Name</p>
                    <p className='fs-12 color-monoNormal'>Date of Birth</p>
                    <p className='fs-12 color-monoNormal'>Address Line 1</p>
                    <p className='fs-12 color-monoNormal'>City</p>
                    <p className='fs-12 color-monoNormal'>Country</p>

                </div>
                <div className=''>
                    <p className='emptySpace'>tag</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.firstName?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.firstName?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.middleName?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.middleName?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.lastName?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.lastName?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.dateOfBirth?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.dateOfBirth?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.addressLine1?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.addressLine1?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.city?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.city?.matchCriteria || 'Not Available'}</p>
                    <p className={`badge badge-pill badge-pink ${recordDetails.country?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}>{recordDetails.country?.matchCriteria || 'Not Available'}</p>
                </div>
                <div className='internal-info'>
                    <p className='color-monoNormal'>Internal Info</p>
                    <p>{recordDetails.firstName?.internalInfo}</p>
                    <p>{recordDetails.middleName?.internalInfo}</p>
                    <p>{recordDetails.lastName?.internalInfo}</p>
                    <p>{recordDetails.dateOfBirth?.internalInfo}</p>
                    <p>{recordDetails.addressLine1?.internalInfo}</p>
                    <p>{recordDetails.city?.internalInfo}</p>
                    <p><img src={require('../assets/images/icons/flag.svg').default} alt=""/> {recordDetails.country?.internalInfo}</p>
                </div>
                <div className=''>
                    <p className='color-monoNormal'>Matched Entity</p>
                    <p>{recordDetails.firstName?.matchedEntity}</p>
                    <p>{recordDetails.middleName?.matchedEntity}</p>
                    <p>{recordDetails.lastName?.matchedEntity}</p>
                    <p>{recordDetails.dateOfBirth?.matchedEntity}</p>
                    <p>{recordDetails.addressLine1?.matchedEntity}</p>
                    <p>{recordDetails.city?.matchedEntity}</p>
                    <p><img src={require('../assets/images/icons/flag.svg').default} alt=""/> {recordDetails.country?.matchedEntity}</p>
                </div>
            </div>
        </div>
    )
}

export default IndividualRecordDetails;
