import React, { useState } from 'react'
import { StepperProps } from '@/types/stepper.type'

function Attestation() {
  return (
    <div className='space-y-4'>
      <h2 className='font-montserrat mb-1 text-xl font-semibold'>
        Applicant Attestation
      </h2>

      <div className='dashboard-body-content'>
        {/* Bio Data */}
        <div className='ethical-preveiw-table'>
          <span className='table-head-title'>Bio Data Information</span>
          <table>
            <tbody>
              <tr>
                <td width='40%'>First Name</td>
                <td>TEST</td>
              </tr>
              <tr>
                <td width='40%'>Last Name</td>
                <td>TEST</td>
              </tr>

              <tr>
                <td width='40%'>Other Name</td>
                <td>TEST</td>
              </tr>
              <tr>
                <td width='40%'>Previous Name</td>
                <td>TEST</td>
              </tr>

              <tr>
                <td>Email</td>
                <td>test@gmail.com</td>
              </tr>
              <tr>
                <td>Phone Number</td>
                <td>0102</td>
              </tr>
              <tr>
                <td>Nationality</td>
                <td>0102</td>
              </tr>
              <tr>
                <td>State</td>
                <td>0102</td>
              </tr>

              <tr>
                <td>LGA</td>
                <td>0102</td>
              </tr>
              <tr>
                <td>Date of birth</td>
                <td>0122</td>
              </tr>
              <tr>
                <td>Gender</td>
                <td>0102</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <br />

        {/* Academic History */}
        <div className='ethical-preveiw-table'>
          <span className='table-head-title'>Academic History</span>
          <table>
            <tbody>
              <tr>
                <th>Institution 1</th>
              </tr>
              <tr>
                <td width='40%'>Name</td>
                <td>TEST</td>
              </tr>
              <tr>
                <td>Qualification</td>
                <td>test</td>
              </tr>
              <tr>
                <td>Start and End Date </td>
                <td>2020 - 2022</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <br />

        {/* Employment History */}
        <div className='ethical-preveiw-table'>
          <span className='table-head-title'>Employment History</span>
          <table>
            <tbody>
              <tr>
                <td width='40%'>Employer Name</td>
                <td>test</td>
              </tr>
              <tr>
                <td>Address</td>
                <td>test</td>
              </tr>
              <tr>
                <td>Status</td>
                <td>full-time</td>
              </tr>
              <tr>
                <td>startDate</td>
                <td>345349</td>
              </tr>
              <th>
                <td>Work Experience</td>
              </th>
              {/* <tr>
                  <td>Is the project sponsored?</td>
                  <td>{data.hasProjectSponsored ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>
                    Will materials or tissue specimens be shipped out of the
                    country?
                  </td>
                  <td>{data.specimenWillBeShippedOut ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Completed training:</td>
                  <td>{data.completedEthicsTraining ? "Yes" : "No"}</td>
                </tr> */}
            </tbody>
          </table>
        </div>
        <br />
        <br />

        {/* Recommendations */}
        {/* <div className="ethical-preveiw-table">
            <span className="table-head-title">Research information</span>
            <table>
              <tbody>
                <tr>
                  <td width="40%">Title of research</td>
                  <td>{data.researchTitle}</td>
                </tr>
                <tr>
                  <td>Objectives of the study</td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.objectivesOfTheStudy,
                      }}
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td>Are You Principal Investigator</td>
                  <td>
                    {data.areYouInvestigatorOrLocalPrincipalInvestigator
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
                <tr>
                  <td>Has Co-Principal investigator(s)</td>
                  <td>
                    {principals.length !== 0 ? (
                      <p
                        style={{
                          fontStyle: "italic",
                          fontSize: "0.8rem",
                        }}
                      >
                        List of co-principal investigators
                      </p>
                    ) : (
                      ""
                    )}
                    {principals && principals.length !== 0
                      ? principals?.map((e, index) => {
                          return (
                            <div key={index}>
                              <span
                                style={{
                                  border: "none",
                                }}
                              >
                                {e.firstName} {e.lastName}
                                <br />
                                {e.email}
                              </span>
                            </div>
                          );
                        })
                      : "No"}
                  </td>
                </tr>
                <tr>
                  <td>Is the project sponsored?</td>
                  <td>{data.hasProjectSponsored ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>
                    Will materials or tissue specimens be shipped out of the
                    country?
                  </td>
                  <td>{data.specimenWillBeShippedOut ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Completed training:</td>
                  <td>{data.completedEthicsTraining ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <br /> */}

        {/* Upload */}
        {/* <div className="ethical-preveiw-table">
            <span className="table-head-title">Research information</span>
            <table>
              <tbody>
                <tr>
                  <td width="40%">Title of research</td>
                  <td>{data.researchTitle}</td>
                </tr>
                <tr>
                  <td>Objectives of the study</td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html: data.objectivesOfTheStudy,
                      }}
                    ></div>
                  </td>
                </tr>
                <tr>
                  <td>Are You Principal Investigator</td>
                  <td>
                    {data.areYouInvestigatorOrLocalPrincipalInvestigator
                      ? "Yes"
                      : "No"}
                  </td>
                </tr>
                <tr>
                  <td>Has Co-Principal investigator(s)</td>
                  <td>
                    {principals.length !== 0 ? (
                      <p
                        style={{
                          fontStyle: "italic",
                          fontSize: "0.8rem",
                        }}
                      >
                        List of co-principal investigators
                      </p>
                    ) : (
                      ""
                    )}
                    {principals && principals.length !== 0
                      ? principals?.map((e, index) => {
                          return (
                            <div key={index}>
                              <span
                                style={{
                                  border: "none",
                                }}
                              >
                                {e.firstName} {e.lastName}
                                <br />
                                {e.email}
                              </span>
                            </div>
                          );
                        })
                      : "No"}
                  </td>
                </tr>
                <tr>
                  <td>Is the project sponsored?</td>
                  <td>{data.hasProjectSponsored ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>
                    Will materials or tissue specimens be shipped out of the
                    country?
                  </td>
                  <td>{data.specimenWillBeShippedOut ? "Yes" : "No"}</td>
                </tr>
                <tr>
                  <td>Completed training:</td>
                  <td>{data.completedEthicsTraining ? "Yes" : "No"}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <br />
          <br /> */}
      </div>
    </div>
  )
}

export default Attestation
