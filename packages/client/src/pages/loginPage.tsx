import React, {FormEvent, useContext, useState } from 'react';
import { Link } from "react-router-dom";
import background from '../assets/images/bg-splash.svg'
import {AppContext} from "../utils";
import * as notify from 'src/services/notification.service';
import * as authService from 'src/services/auth.service';
import * as constants from "src/constants";
import * as CryptoJS from "crypto-js";

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState(process.env.REACT_APP_USERNAME || '');
    const [password, setPassword] = useState(process.env.REACT_APP_PASSWORD || '');
    const {markAsAuthenticated} = useContext(AppContext);

    const submit = (event: FormEvent) => {
        event.preventDefault();
        if (username && password) {
            authService.authenticateUser({
                username,
                password: CryptoJS.AES.encrypt(password, process.env.REACT_APP_ENCRYPTION_SECRET).toString()
            })
                .then((res) => {
                    authService.setJwtToken(res.data.data.token)
                    authService.persistCurrentUser(res.data.data.user);
                    markAsAuthenticated();
                })
                .catch((error) => {
                    if (!error.response.handled) {
                        notify.error(constants.TEXT_INVALID_CREDENTIALS);
                    }
                });
        }
    }

    const usernameChanged = (e: any) => {
        setUsername(e.target.value);
    }
    const passwordChanged = (e: any) => {
        setPassword(e.target.value);
    }

    return (
        <div className="login bg-image text-white py-4 ff-roboto" style={{backgroundImage: `url(${background})`}}>
            <div className="container-fluid d-flex align-items-center justify-content-center h-100">
                <div className="row">
                    <div className="col-lg-12 text-center">
                        <h2 className="fs-64 ff-abel">CleverChain</h2>
                        <p className='fs-14>CleverChain'>CleverChain slogan or statement</p>
                    </div>
                    <div className="col-lg-12 my-auto">
                        <form className="row g-3 login-form" onSubmit={submit}>
                            <div className="col-lg-12 my-2">
                                <input type="text"
                                    id='username'
                                    className="form-control"
                                    value={username}
                                    onChange={usernameChanged}
                                    required={true}
                                    placeholder="username"
                                />
                            </div>
                            <div className="col-lg-12 my-2">
                                <input type="password"
                                    id='password'
                                    className="form-control"
                                    value={password}
                                    onChange={passwordChanged}
                                    required={true}
                                    placeholder="password"
                                />
                            </div>
                            <div className="col my-6">
                                <div className="custom-control custom-checkbox">
                                    <input type="checkbox" className="custom-control-input" id="customCheck1"/>
                                    <label className="custom-control-label fs-14 text-white" htmlFor="customCheck1">
                                        Remember me
                                    </label>
                                </div>
                            </div>
                            <div className="col my-6 text-right">
                                <Link className="text-white " to="#">
                                    Forgot your password?
                                </Link>
                            </div>
                            <div className="col-lg-12 mt-0">
                                <button
                                    data-testid='login-button'
                                    type="submit"
                                    className="btn-login d-block"
                                >
                                    Login
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div className='any-query'>
                <img src={require('../assets/images/any-query.svg').default} alt=""/>
            </div>
        </div>
    );
};

export default LoginPage;
