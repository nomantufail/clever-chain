import React, {useEffect, useState} from 'react';
import IScreenedResult from '@cc/shared-service/src/server/types/response/partials/IScreenedResult'
import {EntityType} from 'src/enums'
import IndividualRecordDetails from "src/components/IndividualRecordDetails";
import BusinessRecordDetails from "src/components/BusinessRecordDetails";
import moment from "moment";

interface IProps {
    record: IScreenedResult,
    openedRecord: string,
    setOpenedRecord: (recordId: string) => void;
}

// @ts-ignore
const ScreeningResultRecord: (props: IProps) => JSX.Element = ({ record, setOpenedRecord, ...props}: IProps) => {
    const [values, setValues] = useState({
        isRecordDetailsOpened: false,
    })

    useEffect(() => {
        if (record.id !== props.openedRecord && values.isRecordDetailsOpened) {
            setValues({ ...values, isRecordDetailsOpened: false })
        }
    }, [props.openedRecord])

    /**
     * This function manages the details hide/show feature.
     */
    const detailsToggleHandler = () => {
        setValues({
            ...values,
            isRecordDetailsOpened: !values.isRecordDetailsOpened
        })
        if (!values.isRecordDetailsOpened) {
            setOpenedRecord(record.id)
        } else {
            setOpenedRecord('')
        }
    }

    return (
        <li data-testid='screening-result-record-container' className={`${values.isRecordDetailsOpened ? "opened" : ""}`}>
            <div className='t-row border-bottom hvg-bg color-monoIntense'>
                <span>{ record.name }</span>
                <span className='position-relative tag'>
                    <p className={"badge badge-pill text-white py-1 px-3 cursor-pointer badge-color-" + record.match.toLowerCase().replace(/\s/g, '-')}>{ record.match }</p>
                    <div className='tool-tip'>
                        <p className='my-1'>{record.match_description}</p>
                    </div>
                </span>
                <span>{ record.database }</span>
                <span>{ record.category }</span>
                <span>{ record.subcategory }</span>
                <span>{ moment(record.bridger_updated).format('MMM Do YYYY') }</span>
                <span>
                    <img
                        data-testid='details-opener'
                        onClick={detailsToggleHandler}
                        className='cursor-pointer icon'
                        src={require('src/assets/images/icons/chevron-down.svg').default}
                        alt=""
                    />
                </span>
            </div>
            {
                values.isRecordDetailsOpened
                &&
                record.entity_type === EntityType.Individual
                &&
                <IndividualRecordDetails recordDetails={JSON.parse(record.mapped_entity_details)} />
            }
            {
                values.isRecordDetailsOpened
                &&
                record.entity_type === EntityType.Business
                &&
                <BusinessRecordDetails recordDetails={JSON.parse(record.mapped_entity_details)} />
            }
        </li>
    )
}

export default ScreeningResultRecord;
