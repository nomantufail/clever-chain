import {useEffect, useState} from 'react';
import './App.css';
import './styles/styles.ts';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import {
    LoginPage,
    DashboardPage,
    BatchScreeningPage,
    BusinessLightScreeningPage,
    IndividualLightScreeningPage,
    BatchJobEntitiesPage,
    BatchJobEntityMatchesPage
} from "./pages";
import {AppContext} from 'src/utils';
import {CleverScreenLayout, LightningScreeningLayout} from "./layouts";
import {ToastContainer} from "react-toastify";
import * as authService from 'src/services/auth.service';
import * as errorsHandler from 'src/services/errors.service';
import axios from 'src/services/axiosInstance.service';
import {AxiosRequestConfig, AxiosResponse} from "axios";
import IUser from "@cc/shared-service/src/server/types/response/IUser";
import MatchFullReportPage from "src/pages/MatchFullReportPage";

function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [currentUser, setCurrentUser] = useState<IUser>();

    function markAsAuthenticated() {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setIsAuthenticated(true);
            setCurrentUser(currentUser)
            axios.defaults.headers.common['Authorization'] = authService.getJwtToken();
        }
    }

    function logout() {
        authService.logout()
            //@ts-ignore
            .then((res) => {
                logoutLocally();
            })
            .catch(() => {})
    }

    function logoutLocally() {
        authService.setJwtToken('')
        axios.defaults.headers.common['Authorization'] = '';
        authService.deletePersistedCurrentUser()
        setCurrentUser(undefined);
        setIsAuthenticated(false)
    }

    useEffect(() => {
        axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;
        axios.defaults.headers.common['Authorization'] = authService.getJwtToken();

        /**
         * Adding a global request interceptors.
         */
        axios.interceptors.request.use((config: AxiosRequestConfig) => {
            if (config.headers) {
                config.headers['Authorization'] = authService.getJwtToken();
            }
            return config;
        }, function (error: any) {
            return Promise.reject(error);
        });

        /**
         * Adding a global response interceptors.
         */
        axios.interceptors.response.use(
            (response: AxiosResponse) => response,
            (error: any) => {
                error = errorsHandler.handleGlobalErrors(
                    error,
                    {
                        authenticationErrorHandler: logoutLocally
                    }
                )
                return Promise.reject(error);
            });

        /**
         * Upon refresh check if user already logged in
         */
        const user = authService.getCurrentUser();
        if (user) {
            setCurrentUser(user);
            setIsAuthenticated(true)
        }
        /***************************************/

    }, [])

    return (
        <AppContext.Provider value={{isAuthenticated, currentUser, markAsAuthenticated, logout}}>
            <BrowserRouter>
                {
                    !isAuthenticated ?
                        <Routes>
                            <Route path="/" element={<LoginPage/>} key="login"/>,
                            <Route path="*" element={<LoginPage/>} key="default-guest-page"/>
                        </Routes> :
                        (<CleverScreenLayout>
                            <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" />} key="dashboard-redirection"/>,

                                <Route path="/dashboard" element={<DashboardPage />} key="dashboard"/>,

                                <Route path="/lightning-screening/business" element={
                                    <LightningScreeningLayout>
                                        <BusinessLightScreeningPage/>
                                    </LightningScreeningLayout>
                                } key="business-light-screening"/>,

                                <Route path="/lightning-screening" element={<Navigate to="/lightning-screening/business" />} key="light-screening-redirection"/>,
                                <Route path="/lightning-screening/individual" element={
                                    <LightningScreeningLayout>
                                        <IndividualLightScreeningPage/>
                                    </LightningScreeningLayout>
                                } key="individual-light-screening"/>,

                                <Route path="/batch-screening" element={
                                    <BatchScreeningPage/>
                                } key="business-batch-screening"/>,

                                <Route path="/batch-screening/job-entities/:jobId" element={
                                    <BatchJobEntitiesPage/>
                                } key="batch-job-entities"/>,

                                <Route path="/batch-screening/job-entity-matches/:jobId/:jobEntityId" element={
                                    <BatchJobEntityMatchesPage/>
                                } key="batch-job-entity-matches"/>,

                              <Route path="/match/full-report/:matchId" element={
                                <MatchFullReportPage/>
                              } key="match-full-report"/>,

                              <Route
                                  path="*"
                                  element={
                                      <div>
                                          <h2>404 Page not found</h2>
                                      </div>
                                  }
                                />
                            </Routes>
                        </CleverScreenLayout>)
                }
            </BrowserRouter>
            <ToastContainer/>
        </AppContext.Provider>
    );
}

export default App;
