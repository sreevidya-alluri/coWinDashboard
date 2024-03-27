// Write your code here
import {Component} from 'react'
import Loader from 'react-loader-spinner'
import VaccinationCoverage from '../VaccinationCoverage'
import VaccinationByAge from '../VaccinationByAge'
import VaccinationByGender from '../VaccinationByGender'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}
class CowinDashboard extends Component {
  state = {
    coverageData: [],
    ageData: [],
    genderData: [],
    apiStatus: apiStatusConstants.initial,
  }

  getCovidData = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const response = await fetch('https://apis.ccbp.in/covid-vaccination-data')
    if (response.ok === true) {
      const data = await response.json()
      const updatedData = data.last_7_days_vaccination.map(eachItem => ({
        vaccineData: eachItem.vaccine_data,
        dose1: eachItem.dose_1,
        dose2: eachItem.dose_2,
      }))
      const updatedAgeData = data.vaccination_by_age.map(eachAge => ({
        age: eachAge.age,
        count: eachAge.count,
      }))
      const updatedGenderData = data.vaccination_by_gender.map(eachGender => ({
        count: eachGender.count,
        gender: eachGender.gender,
      }))
      this.setState({
        coverageData: updatedData,
        ageData: updatedAgeData,
        genderData: updatedGenderData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }
  renderSuccessView = () => {
    const {coverageData, ageData, genderData} = this.state
    return (
      <div>
        <VaccinationCoverage coverageData={coverageData} />
        <VaccinationByAge ageData={ageData} />
        <VaccinationByGender genderData={genderData} />
      </div>
    )
  }
  renderFailureView = () => {
    return (
      <div>
        <img
          src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
          alt="failure view"
          className="failure-view"
        />
        <h1 className="failure-heading">Something went wrong</h1>
      </div>
    )
  }
  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height={80} width={80} />
    </div>
  )
  renderViewsBasedOnApiStatus = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
  componentDidMount() {
    this.getCovidData()
  }
  render() {
    return (
      <div className="container">
        <div className="cowin-container">
          <img
            src="https://assets.ccbp.in/frontend/react-js/cowin-logo.png"
            alt="website logo"
            className="website-logo"
          />
          <h1 className="heading">Co-WIN</h1>
        </div>
        <div className="heading-and-charts">
          <h1>CoWIN Vaccination in India</h1>
        </div>
        {this.renderViewsBasedOnApiStatus()}
      </div>
    )
  }
}
export default CowinDashboard
