import React, { useEffect, useState } from "react";

interface IProps {
  summary?: string
  recordId?: string
}

const RecordSummaryComponent: (props: IProps) => JSX.Element = ({summary, recordId}: IProps) => {
  const [summaryCollection, setSummaryCollection] = useState<string[]>([]);
  const [profileNotes, setProfileNotes] = useState<string>('');
  const [sources, setSources] = useState<string[]>([]);
  useEffect(() => {
    if (summary) {
      const parsedSummary = JSON.parse(summary);
      setSummaryCollection(parsedSummary.filter((comment: string) => !comment.startsWith("Profile Notes:") && !comment.startsWith('Sources:')));
      const profileNotes = parsedSummary.find((comment: string) => comment.startsWith("Profile Notes:")) || ''
      setProfileNotes(profileNotes);
      const sources = parsedSummary.filter((comment: string) => comment.startsWith("Sources:")) || ''
      setSources(sources);
    } else {
      setSummaryCollection([]);
      setProfileNotes('');
    }
  }, [summary]);

  const openFullReport = () => {
    window.open(`/match/full-report/${recordId}`, '_blank', 'noopener,noreferrer');
  }

    return (
        <>
            <div data-testid='record-summary-container'>
                {
                    !summary
                    &&
                    <div className='matchDetails text-center my-16 px-4'>
                        <h6 className='fw-medium'>Match Details</h6>
                        <img className='my-8'
                             src={require('src/assets/images/placeholder-illustration.svg').default} alt=""/>
                        <p className='mb-0 color-monoNormal px-8'>Select a match to view details</p>
                    </div>
                }
                {
                    summary
                    &&
                    <div className="summary fs-12 color-monoIntense">
                        <div className='p-4'>
                            <div className='row'>
                                <div className='col-lg-12'>
                                    <p className='color-monoNormal'>
                                        Summary
                                    </p>
                                  {
                                    summaryCollection.map((comment) => {
                                        return <p key={comment}>{comment}</p>
                                    })
                                  }
                                  <p>{profileNotes.length > 500 ? profileNotes.slice(0, 500).concat('...') : profileNotes}</p>
                                  {
                                    sources.map((source, index) => {
                                      return <>
                                        <a key={index} href={source.split('Sources:')[1]}>
                                          {source.split('Sources:')[1]}
                                        </a>
                                        <br/>
                                      </>
                                    })
                                  }
                                  <button
                                    data-testid='view-full-report'
                                    onClick={() => {openFullReport()}}
                                    type='button' className='button ltGrey-btn w-100 mt-8 fw-medium'>
                                    View Full Report
                                  </button>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </div>
        </>
    );
};

export default RecordSummaryComponent;
