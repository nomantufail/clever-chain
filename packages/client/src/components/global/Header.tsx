import React, {useContext} from 'react';
import {AppContext} from "src/utils";

const Header: React.FC = () => {
  const {currentUser, logout} = useContext(AppContext)

  return (
    <header className="bg-darkBlue py-3 px-5 fixed-top">
      <div className="d-flex justify-content-between align-items-center">
        <div>
          <img src={require('../../assets/images/logo.svg').default} alt="Logo" />
        </div>
        <div>
          <div className="dropdown">
            <button
                className="btn btn-secondary dropdown-toggle"
                type="button" id="dropdownMenuButton1"
                data-toggle="dropdown"
                aria-expanded="false"
                aria-haspopup="true"
            >
              <img className='userPic' src={require('../../assets/images/profile-icon.svg').default} alt="user-avatar" />
              {currentUser?.username}
              <img src={require('../../assets/images/icons/chevron-down.svg').default} alt="" />
            </button>
             <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton1">
              <li className='dropdown-item'><i className="fa fa-user" /> View Profile</li>
              <li className='dropdown-item'><i className="fa fa-user" /> Setting</li>
              <li className='dropdown-item' data-testid='logout-btn' onClick={logout}><i className="fa fa-user" /> Logout</li>
            </ul>
          </div>
        </div>
      </div>
    </header>

  );
};

export default Header;
