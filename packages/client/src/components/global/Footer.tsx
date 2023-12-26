import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer>
      <div className="row">
        <div className="col-lg-12">
          <div className="color-monoDull">
            <p className="-0 fs-14 d-flex align-items-center justify-content-center">Powered by <img className="mx-2" src={require('../../assets/images/logo-footer-.svg').default} alt="" /></p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
