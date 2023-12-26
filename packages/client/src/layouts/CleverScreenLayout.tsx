import React, {useContext} from 'react';
import Header from '../components/global/Header';
import Sidebar from '../components/global/Sidebar';
import Footer from '../components/global/Footer';
import { useLocation } from "react-router-dom";
import { locale } from "moment";

const MainLayout: React.FC = (props) => {
    const location = useLocation();
    return (
        <div className='main'>
            {
                !location.pathname.includes('/full-report/') &&
                  <>
                      <Header />
                      <div className='wrapper'>
                          <Sidebar />
                          <div className='main-content'>
                              <div className='content-box'>
                                  <div className='row'>
                                      <div className="col-lg-12">
                                          {props.children}
                                      </div>
                                  </div>
                              </div>
                              <Footer/>
                          </div>
                      </div>
                  </>
            }
            {
                location.pathname.includes('/full-report/') && props.children
            }
        </div>
    );
};

export default MainLayout;
