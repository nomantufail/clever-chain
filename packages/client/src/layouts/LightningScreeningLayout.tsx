import React from 'react';
import {NavLink} from "react-router-dom";

const LightningScreeningLayout: React.FC = ({children}) => {
    return (
        <div>
            <div className="row">
                <div className="col-lg-12">
                    <div className="card-title">
                        <h4>SCREEN CUSTOMERS</h4>
                    </div>
                </div>
                <div className="col-lg-12">
                    <div className="tabs-header p-0">
                        <div className="d-flex tabs">
                            <NavLink
                                to='/lightning-screening/business'
                            >
                                <h4 className='m-0'>Business</h4>
                            </NavLink>
                            <NavLink
                                to='/lightning-screening/individual'
                            >
                                <h4 className='m-0'>Individual</h4>
                            </NavLink>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LightningScreeningLayout;
