import React, { useEffect, useRef, useState } from "react";
import IFullReport from "src/types/IFullReport";
import * as notify from "src/services/notification.service";
import * as reportsService from "src/services/reports.service";
import { useParams } from "react-router-dom";


const MatchFullReportPage: React.FC = () => {
  const [report, setReport] = useState<IFullReport>();
  const [loading, setLoading] = useState<boolean>(true);
  const {matchId} = useParams();

  const fetchReport = () => {
    reportsService.fetchMatchReport(matchId!)
      .then((response) => {
        setReport(response.data.data.report);
      })
      .catch((err: any) => {
        if (!err.response.handled) {
          if (err.response && err.response.data && err.response.data.error.message)
            notify.error(err.response.data.error.message);
        }
      })
      .finally(() => {});
  }

  useEffect(() => {
    fetchReport();
  }, []);

  return (
    <>
      {
        !report &&
        <div className={`overlay-loader active`}>
          <div className={`loader text-center`}>
            <img src={require('src/assets/images/logo-icon.svg').default} alt=""/>
            <p className='mt-6'>loading report...</p>
          </div>
        </div>
      }
      {
        report &&
        <section className="report-wrapper">
          <div className="row">
            <div className="col-lg-12 report-info">
              <img src={require("src/assets/images/cleverscreen-accent-logo.png")} alt="Logo" />
              <div className="mt-4">
                <h5 className="color-monoIntense match-name"><strong>{report.name}</strong>
                  <p
                    className={`badge badge-pill text-white py-1 px-3 badge-color-${report.matchCriteria.toLowerCase().replace(/\s/g, "-") || ""}`}
                  >{report.matchCriteria}</p>
                </h5>
                {
                  report.occupation && <p className="color-monoNormal">{report.occupation}</p>
                }
              </div>
              <div className="my-8">
                {
                  report.matchDescription.map((desc, index) => <p key={index} className="color-monoNormal">{desc}</p>)
                }
                <p className="color-monoNormal">Last screening date: {report.scannedDate}</p>
              </div>
            </div>
          </div>

          <div className="page-1 row">
            <div className="col-lg-12 p-0">
              <table className="table">
                <thead>
                <tr>
                  <th></th>
                  <th></th>
                  <th></th>
                  <th><h6 className="color-monoNormal upper-case">Internal DATA</h6></th>
                  <th><h6 className="color-monoNormal upper-case">Matched Entity</h6></th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <td><h6 className="color-monoNormal upper-case">General Information</h6></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {
                  report.generalInformation.firstName &&
                  <>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">First Name</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.firstName.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.firstName?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.firstName?.internalInfo && !report.generalInformation.firstName?.matchedEntity
                            ) ? '' : report.generalInformation.firstName?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.firstName.internalInfo || '-'}</td>
                      <td>{report.generalInformation.firstName.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">Middle Name</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.middleName.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.middleName?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.middleName?.internalInfo && !report.generalInformation.middleName?.matchedEntity
                            ) ? '' : report.generalInformation.middleName?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.middleName.internalInfo || '-'}</td>
                      <td>{report.generalInformation.middleName.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">Last Name</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.lastName.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.lastName?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.lastName?.internalInfo && !report.generalInformation.lastName?.matchedEntity
                            ) ? '' : report.generalInformation.lastName?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.lastName.internalInfo || '-'}</td>
                      <td>{report.generalInformation.lastName.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">AKA</td>
                      <td>
                        <p
                          className={`badge badge-pill`}
                        >

                        </p>
                      </td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">Date of Birth</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.dateOfBirth.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.dateOfBirth?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.dateOfBirth?.internalInfo && !report.generalInformation.dateOfBirth?.matchedEntity
                            ) ? '' : report.generalInformation.dateOfBirth?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.dateOfBirth.internalInfo || '-'}</td>
                      <td>{report.generalInformation.dateOfBirth.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">Gender</td>
                      <td>
                        <p
                          className={`badge badge-pill`}
                        >

                        </p>
                      </td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </>
                }
                {
                  report.generalInformation.registeredName &&
                  <>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">Registered Name</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.registeredName.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.registeredName?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.registeredName?.internalInfo && !report.generalInformation.registeredName?.matchedEntity
                            ) ? '' : report.generalInformation.registeredName?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.registeredName.internalInfo || '-'}</td>
                      <td>{report.generalInformation.registeredName.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">Trading Name</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.tradingName?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.tradingName?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.tradingName?.internalInfo && !report.generalInformation.tradingName?.matchedEntity
                            ) ? '' : report.generalInformation.tradingName?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.tradingName?.internalInfo || '-'}</td>
                      <td>{report.generalInformation.tradingName?.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">EIN Name</td>
                      <td>
                        <p
                          className={`badge badge-pill ${report.generalInformation.ein?.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                        >
                          {
                            report.generalInformation.ein?.matchCriteria.toLowerCase() === 'not available'
                            || (
                              !report.generalInformation.ein?.internalInfo && !report.generalInformation.ein?.matchedEntity
                            ) ? '' : report.generalInformation.ein?.matchCriteria
                          }
                        </p>
                      </td>
                      <td>{report.generalInformation.ein?.internalInfo || '-'}</td>
                      <td>{report.generalInformation.ein?.matchedEntity || '-'}</td>
                    </tr>
                    <tr>
                      <td></td>
                      <td className="color-monoNormal">AKA</td>
                      <td>
                        <p className={`badge badge-pill`}></p>
                      </td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </>
                }
                  </tbody>
              </table>
              <div className="line-divider"></div>
              <table className="table">
                <tbody>
                <tr>
                  <td><h6 className="color-monoNormal upper-case">Address and Location</h6></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td></td>
                  <td className="color-monoNormal">Current Address</td>
                  <td>
                    <p
                      className={`badge badge-pill ${report.addressAndLocation.currentAddress.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                    >
                      {
                        report.addressAndLocation.currentAddress?.matchCriteria.toLowerCase() === 'not available'
                        || (
                          !report.addressAndLocation.currentAddress.internalInfo && !report.addressAndLocation.currentAddress.matchedEntity
                        ) ? '' : report.addressAndLocation.currentAddress?.matchCriteria
                      }
                    </p>
                  </td>
                  <td>{report.addressAndLocation.currentAddress.internalInfo || '-'}</td>
                  <td>{report.addressAndLocation.currentAddress.matchedEntity || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="color-monoNormal">Postal Code</td>
                  <td>
                    <p
                      className={`badge badge-pill ${report.addressAndLocation.postalCode.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                    >
                      {
                        report.addressAndLocation.postalCode?.matchCriteria.toLowerCase() === 'not available'
                        || (
                          !report.addressAndLocation.postalCode.internalInfo && !report.addressAndLocation.postalCode.matchedEntity
                        ) ? '' : report.addressAndLocation.postalCode?.matchCriteria
                      }
                    </p>
                  </td>
                  <td>{report.addressAndLocation.postalCode.internalInfo || '-'}</td>
                  <td>{report.addressAndLocation.postalCode.matchedEntity || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="color-monoNormal">City</td>
                  <td>
                    <p
                      className={`badge badge-pill ${report.addressAndLocation.city.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                    >
                      {
                        report.addressAndLocation.city?.matchCriteria.toLowerCase() === 'not available'
                        || (
                          !report.addressAndLocation.city.internalInfo && !report.addressAndLocation.city.matchedEntity
                        ) ? '' : report.addressAndLocation.city?.matchCriteria
                      }
                    </p>
                  </td>
                  <td>{report.addressAndLocation.city.internalInfo || '-'}</td>
                  <td>{report.addressAndLocation.city.matchedEntity || '-'}</td>
                </tr>
                <tr>
                  <td></td>
                  <td className="color-monoNormal">Country</td>
                  <td>
                    <p
                      className={`badge badge-pill ${report.addressAndLocation.country.matchCriteria.toLowerCase().replace(/\s/g, '') || ''} px-3`}
                    >
                      {
                        report.addressAndLocation.country?.matchCriteria.toLowerCase() === 'not available'
                        || (
                          !report.addressAndLocation.country.internalInfo && !report.addressAndLocation.country.matchedEntity
                        ) ? '' : report.addressAndLocation.country?.matchCriteria
                      }
                    </p>
                  </td>
                  <td>{report.addressAndLocation.country.internalInfo || '-'}</td>
                  <td>{report.addressAndLocation.country.matchedEntity || '-'}</td>

                </tr>
                </tbody>
              </table>
              <div className="line-divider"></div>
              <table className="table">
                <tbody>
                <tr>
                  <td><h6 className="color-monoNormal upper-case">Other Addresses </h6></td>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                {
                  report.otherAddresses.map((address, index) => {
                    return <tr key={index}>
                      <td></td>
                      <td className="color-monoNormal">Full Address {index + 1}</td>
                      <td></td>
                      <td>{address}</td>
                      <td></td>
                    </tr>
                  })
                }
                </tbody>
              </table>
            </div>
          </div>
          <div className="page-2">
            <div className="row">
              <div className="col-lg-12">
                <div className="finding">
                  <table className="table">
                    <thead>
                    <tr>
                      <th><h6 className="color-monoNormal upper-case">FINDING</h6></th>
                      <th></th>
                      <th></th>
                    </tr>
                    </thead>

                    <tbody>
                    {
                      report.findings.map((finding, index) => {
                        return <tr key={index}>
                          <td></td>
                          <td className="color-monoNormal">{finding.key}</td>
                          <td className="color-monoIntense">
                            {
                              finding.value.length == 1 && finding.value[0]
                            }
                            {
                              finding.value.length > 1 &&
                              <ul>
                                {finding.value.map((item, index) => {
                                  return <li key={index}>{item}</li>
                                })}
                              </ul>
                            }
                          </td>
                        </tr>
                      })
                    }
                    </tbody>
                  </table>
                </div>

              </div>
            </div>
            <div className="line-divider"></div>
            <div className="row">
              <div className="col-lg-12 mt-3 profile-notes">
                <h6 className="upper-case color-monoNormal">PROFILE NOTES</h6>
                <>
                  {!report.profileNotes.toString() && <p>'N/A'</p>}
                  {
                    report.profileNotes.toString() && report.profileNotes.toString().split('According to').map((notes: string, index) => {
                      return notes && <p key={index}>According to {notes}</p>
                    })
                  }
                </>
                <div className="line-divider"></div>
              </div>
              <div className="col-lg-12 mt-3">
                <h6 className="upper-case color-monoNormal">Source links </h6>
                <ul className="source-links">
                  {
                    report.sourceLinks.map((link, index) => {
                      return <li key={index}>
                        <a
                          className="color-monoIntense hover-color-green"
                          href={link}
                          target="_blank"
                        >{link}</a>
                      </li>
                    })
                  }
                </ul>
              </div>
            </div>
          </div>

        </section>
      }
    </>
  );
};

export default MatchFullReportPage;
