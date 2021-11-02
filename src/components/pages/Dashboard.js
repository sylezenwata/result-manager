import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import config from '../../utils/config';

import '../../styles/m/dashboard.css';

import { callGetResult } from '../../utils/apiCalls';
import ResultRow from '../hoc/ResultRow';
import InternalLoader from '../hoc/InternalLoader';

class Dashboard extends Component {

  state = {
    more: false,
    loadingResults: false,
    loadingMessage: null,
    resultFilter: {
      matno: null, 
      college: null, 
      dept: null, 
      session: null, 
      semester: null, 
      level: null, 
      course: null, 
      offset: (this.props.results?.length || null)
    },
    showFilterForm: false,
    madeSearch: false
  }

  componentDidMount() {
    (!this.props.results || this.props.refreshResults) && this.handleGetResults();
  }

  handleGetResults = async (loadingMessage = 'Getting results, please wait...') => {
    this.setState({loadingResults: true, loadingMessage});
    // validate result filters
    let filter = Object.keys(this.state.resultFilter).reduce((obj, item) => {
      this.state.resultFilter[item] && (obj[item] = this.state.resultFilter[item]);
      return obj;
    }, {});
    let res = await callGetResult(Object.keys(filter).length > 0 ? filter : null);
    if (res.error) {
      this.setState({ loadingResults: false });
      return this.props.dispatchNotifier({message: res.message, type: 'error'});
    }
    const { results, more } = res;
    // store results in redux
    this.props.dispatchResults({
      type: 'add', 
      results: (this.props.results?.concat(results) || results),
      moreResults: more,
      refreshResults: this.state.madeSearch
    });
    // end loading & update resultFilter offset for more results
    this.setState(prevState => ({loadingResults: false, resultFilter: {...prevState.resultFilter, offset: (more ? this.props.results.length : null)}}))
  };

  handleShowFilterForm = async () => {
    // if search was used
    if (this.state.showFilterForm && this.props.refreshResults) {
      this.props.dispatchResults({type: 'clear'});
      await this.setState(prevState => ({
        madeSearch: false,
        resultFilter: {
          ...prevState.resultFilter,
          matno: null, 
          college: null, 
          dept: null, 
          session: null, 
          semester: null, 
          level: null, 
          course: null, 
          offset: null
        }
      }));
      this.handleGetResults('Refreshing results, please wait...');
    }
    this.setState((prevState) => ({showFilterForm: !prevState.showFilterForm}));
  }

  handleFilterFormChange(e) {
    let _name = e.target.name;
    let _value = e.target.value.trim().length > 0 ? e.target.value.trim() : null;
    switch (_name) {
      case 'matno':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,matno: _value}}));
        break;
      case 'college':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,college: _value}}));
        break;
      case 'dept':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,dept: _value}}));
        break;
      case 'session':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,session: _value}}));
        break;
      case 'semester':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,semester: _value}}));
        break;
      case 'level':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,level: _value}}));
        break;
      case 'course':
        this.setState(prevState => ({resultFilter: {...prevState.resultFilter,course: _value}}));
        break;
      default:
        break;
    }
  }

  handleFilterForm = async e => {
    e.preventDefault();
    // val if any filter inputs has data
    if (Object.keys(this.state.resultFilter).some(e => (e !== 'offset'  && this.state.resultFilter[e] !== null))) {
      // clear results and more
      this.props.dispatchResults({type: 'clear'});
      await this.setState(prevState => ({
        madeSearch: true,
        resultFilter: {
          ...prevState.resultFilter,
          offset: null
        }
      }));
      this.handleGetResults('Searching result(s)...');
    } else {
      this.props.dispatchNotifier({message: 'Please enter a valid search value', type: 'error'})
    }
  };

  render() {
    return (
      <>
      <Helmet>
        <title>Dashboard - {config.APP_NAME}</title>
      </Helmet>
      <section id="main-con">
        <div className="main-con__wrap flex flex-col p-lr-10">
            <div className="main-con__head">Dashboard</div>
            <div className="main-con__content position-r">
                <div className="flex flex-col">
                    <div className="box-hol result-wrap">
                        <div className="box p-10 b-rad-5">
                          <div className="flex justify-b align-c flex-wrap m-b-10">
                            <div className="">
                              <h1 className="f-16">Results</h1>
                              <p className="f-12 m-t-5">Use Filter to search for specific result(s)</p>
                            </div>
                            <button onClick={this.handleShowFilterForm.bind(this)} className="btn secondary flex align-c" style={{padding: '5px 10px'}}>
                              <span className="icon stroke-light">
                                <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                  <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                  <circle cx={6} cy={10} r={2} />
                                  <line x1={6} y1={4} x2={6} y2={8} />
                                  <line x1={6} y1={12} x2={6} y2={20} />
                                  <circle cx={12} cy={16} r={2} />
                                  <line x1={12} y1={4} x2={12} y2={14} />
                                  <line x1={12} y1={18} x2={12} y2={20} />
                                  <circle cx={18} cy={7} r={2} />
                                  <line x1={18} y1={4} x2={18} y2={5} />
                                  <line x1={18} y1={9} x2={18} y2={20} />
                                </svg>
                              </span>
                              <span className="p-lr-5">Filter</span>
                            </button>
                            {
                              this.state.showFilterForm && 
                              <div className="filter__wrap position-r">
                                <div className="drop-arrow drop-arrow__up"></div>
                                <form onChange={this.handleFilterFormChange.bind(this)} onSubmit={this.handleFilterForm} method="GET">
                                  <div className="flex flex-wrap align-b p-tb-5 p-lr-5">
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>Matric no.</span>
                                          <input type="text" className="form-input" name="matno" style={{padding: '5px', height: 'unset'}} placeholder="Enter matric no." />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>Course code</span>
                                          <input type="text" className="form-input" name="course" style={{padding: '5px', height: 'unset'}} placeholder="Enter course code" />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>Level</span>
                                          <input type="text" className="form-input" name="level" style={{padding: '5px', height: 'unset'}} placeholder="Enter level" />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>Session</span>
                                          <input type="text" className="form-input" name="session" style={{padding: '5px', height: 'unset'}} placeholder="Enter session" />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>Semester</span>
                                          <input type="text" className="form-input" name="semester" style={{padding: '5px', height: 'unset'}} placeholder="Enter semester" />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>Department</span>
                                          <input type="text" className="form-input" name="dept" style={{padding: '5px', height: 'unset'}} placeholder="Enter dept." />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="input-wrap p-5">
                                      <div className="form-input__wrap">
                                        <label className="form-input__label">
                                          <span style={{fontSize:'10px'}}>College</span>
                                          <input type="text" className="form-input" name="college" style={{padding: '5px', height: 'unset'}} placeholder="Enter college" />
                                        </label>
                                      </div>
                                    </div>
                                    <div className="btn-wrap p-5" style={{marginTop: '0', padding: '5px', height: 'unset'}}>
                                      <button type="submit" className="btn primary" style={{padding: '7px 14px', fontSize: '12px'}}>search</button>
                                    </div>
                                  </div>
                                </form>
                              </div>
                            }
                          </div>
                          <div className="p-tb-10">
                            <div className="table-wrap table-responsive custom-scroll" style={{marginTop: 0}}>
                              <table className="table f-12" data-id="resultList">
                                <thead>
                                  <tr>
                                    <th>No.</th>
                                    <th>Fullname</th>
                                    <th>Matric No.</th>
                                    <th>College</th>
                                    <th>Dept.</th>
                                    <th>Session</th>
                                    <th>Semester</th>
                                    <th>Level</th>
                                    <th>Course</th>
                                    <th>Unit</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                    <th>Grade Point</th>
                                    <th>Quality P</th>
                                    <th>Remark</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {
                                    this.props.results && (
                                      this.props.results.length > 0 
                                      ?  
                                      this.props.results.map((result, index) => <ResultRow result={result} number={index+1} key={result.r_id} />)
                                      : 
                                      <tr style={{backgroundColor:'var(--bg-color)'}}><td colSpan="15" style={{textAlign: 'center'}}>No result was found</td></tr>
                                    )
                                  }
                                  {
                                    !this.props.results && !this.state.loadingResults && <tr style={{backgroundColor:'var(--bg-color)'}}><td colSpan="15" style={{textAlign: 'center'}}>Error getting results</td></tr>
                                  }
                                  {
                                    this.state.loadingResults && <tr style={{backgroundColor:'var(--bg-color)'}}><td colSpan="15" style={{textAlign: 'center'}}>{<InternalLoader message={this.state.loadingMessage} column={true} />}</td></tr>
                                  }
                                  {
                                    this.props.moreResults && !this.state.loadingResults && <tr style={{backgroundColor:'var(--bg-color)'}}><td colSpan="15" style={{textAlign: 'center'}}><div className="btn-wrap flex justify-c" style={{marginTop: '0'}}><button onClick={() => {this.handleGetResults('Getting more results....');}} className="btn secondary" style={{padding: '7px 14px'}}>More</button></div></td></tr>
                                  }
                                </tbody>
                                {/* <tfoot>
                                  <tr>
                                    <th>No.</th>
                                    <th>Fullname</th>
                                    <th>Matric No.</th>
                                    <th>College</th>
                                    <th>Dept.</th>
                                    <th>Session</th>
                                    <th>Semester</th>
                                    <th>Level</th>
                                    <th>Course</th>
                                    <th>Unit</th>
                                    <th>Score</th>
                                    <th>Grade</th>
                                    <th>Grade Point</th>
                                    <th>Quality P</th>
                                    <th>Remark</th>
                                  </tr>
                                </tfoot> */}
                              </table>
                            </div>
                          </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </section>
      </>
    )
  }
}

export default Dashboard;
