import React, { Component } from 'react';
import { Helmet } from 'react-helmet';

import { userService } from '../../services/user';
import config from '../../utils/config';

import Nav from '../layout/Nav';
import Sidebar from '../layout/Sidebar';

import '../../styles/m/upload.css';

import SET from '../../vendors/set';
import { validateData } from '../../utils/funcs';

import { callResultUpload } from '../../utils/apiCalls';
import Noitifier from '../hoc/Notifier';

import BarLoader from '../hoc/BarLoader';
import InternalLoader from '../hoc/InternalLoader';

class Upload extends Component {

  constructor(props) {
    super(props);
    props.dispatchBarLoading('start');
  }
  
  // init state
  state = {
    fileSelected: false,
    fileName: null,
    fileError: false,
    fileErrorMsg: null,
    file: null,
    submitting: false
  }

  componentDidMount() {
    this.props.dispatchBarLoading('end');
  }

  componentWillUnmount() {
    this.props.dispatchNotifier(null);
  }

  // refs
  csvFileRef = React.createRef();
  csvFileSelector = React.createRef();

  handleCsvFile(files) {
    if (files.length <= 0) {
      this.handleClearCsvFile()
      return this.setState({fileError: true, fileErrorMsg: 'You have not selected any CSV file.'});
    }
    if (files.length > 1) {
      this.handleClearCsvFile();
      return this.setState({fileError: true, fileErrorMsg: 'You can only upload one result file at a time.'});
    }
    if (files.length > 0) {
      const csvFile = files[0];
      if (!validateData(csvFile.type.toLowerCase(),/^text\/csv$/)) {
          this.handleClearCsvFile();
          return this.setState({fileError: true, fileErrorMsg: 'Only a csv file is valid.'});
      }
      this.setState({ fileSelected: true, fileName: csvFile.name, file: csvFile });
    }
  }

  handleClearCsvFile = () => {
    this.setState({ fileSelected: false, submitting: false, fileName: null, file: null });
    this.csvFileRef.current.value = null;
  }

  handelDropFile = (e) => {
    e.preventDefault();
    SET.fixClass(['.drag-drop__wrap'],[['active']],[false]);
    this.handleCsvFile(e.dataTransfer.files);
  }

  handleDragOver = (e) => {
    e.preventDefault();
    SET.fixClass(['.drag-drop__wrap'],[['active']],[true]);
  }

  handleDragLeave = (e) => {
    e.preventDefault();
    SET.fixClass(['.drag-drop__wrap'],[['active']],[false]);
  }

  handleFormSubmit = async (e) => {
    e.preventDefault();
    
    // clear existing error
    this.setState({ fileError: false, fileErrorMsg: null });
    
    // validate file selected
    if (!this.state.fileSelected || !this.state.file) {
      return this.setState({fileError: true, fileErrorMsg: 'Please select a csv file.'});
    }

    // submit
    this.setState({ submitting: true });
    const res = await callResultUpload({ file: this.state.file });
    if (res.error) {
      this.setState({ submitting: false });
      return this.props.dispatchNotifier({message: res.message, type: 'error'});
    }
    // clear uploaded file and show success response
    this.handleClearCsvFile();
    this.props.dispatchNotifier({message: (res.message || 'Result upload was successful.'), type: 'success'});
  }

  render() {
    return (
        <>
        <Helmet>
          <title>Upload result - {config.APP_NAME}</title>
        </Helmet>
        <div className="content">
          <Nav user={userService.user} logout={this.props.dispatchLogout}/>
          <Sidebar path={this.props.location.pathname} />
          <BarLoader loading={this.props.barLoading}/>
          <section id="main-con">
            <div className="main-con__wrap flex flex-col p-lr-10">
                <div className="main-con__head">Upload</div>
                <div className="main-con__content position-r flex justify-c p-lr-10" style={{paddingTop: "50px", paddingBottom: "50px"}}>
                  <div className="box-hol uploder-wrap">
                      <div className="box b-rad-5 p-20 flex justify-c align-c">
                          <form onSubmit={this.handleFormSubmit} method="post" encType="multipart/form-data">
                            <div className="f-14">
                              <h1 className="text-cap">Upload result</h1>
                              <p className="f-12 m-t-5">Drop or select the <strong>CSV</strong> result file you wish to upload.</p>
                            </div>
                            <div className={`input-wrap drag-drop__wrap${this.state.fileSelected ? ' active' : ''}`}>
                              <div className="form-input__wrap flex justify-c align-c">
                                <label onDragOver={this.handleDragOver} onDragEnter={this.handleDragOver} onDragLeave={this.handleDragLeave} onDrop={this.handelDropFile} ref={this.csvFileSelector} data-visible={!this.state.fileSelected} htmlFor="csvFile" className="drag-drop" style={{backgroundColor: 'var(--img-bg-color)', width: '100%', height: '100%', padding: '10px 0'}}>
                                  <div className="flex align-c flex-col f-20 f-w-6 text-c text-mute p-tb-5">
                                    <span className="text-cap">Drop file here</span>
                                    <span className="f-14 m-t-10 m-b-10">OR</span>
                                    <div role="button" className="btn default f-14 flex align-c" style={{padding: '7px 14px', cursor: 'pointer'}}>
                                      <span className="icon stroke">
                                        <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                          <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                                          <path d="M12 21h-5a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v4.5" />
                                          <circle cx="16.5" cy="17.5" r="2.5" />
                                          <line x1="18.5" y1="19.5" x2={21} y2={22} />
                                        </svg>
                                      </span>
                                      <span className="p-lr-5">Choose file</span>
                                    </div>
                                  </div>
                                </label>
                                <div data-visible={this.state.fileSelected} className="file-selected p-tb-10">
                                  <div className="f-16 text-color">{this.state.fileSelected && this.state.fileName}</div>
                                </div>
                                <input disabled={this.state.submitting} ref={this.csvFileRef} onChange={e => this.handleCsvFile(e.target.files)} type="file" className="hide-file-input" style={{height: '0'}} id="csvFile" name="csv_file" />
                              </div>
                            </div>
                            {
                              this.state.fileError && <div className="form-input-error">
                                <svg className="form-input-error-icon" focusable="false" width="16px" height="16px" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"></path>
                                </svg>
                                <span>{this.state.fileErrorMsg}</span>
                              </div>
                            }
                            <div className="flex justify-e" style={{paddingTop: '5px', visibility: `${this.state.fileSelected ? 'visible' : 'hidden'}`}}><button disabled={this.state.submitting} type="button" onClick={this.handleClearCsvFile} className="btn default f-12" style={{backgroundColor: 'transparent', padding: '5px', color: 'var(--sec-color-scheme)', textDecoration: 'underline', border: 'none', outline: 'none', boxShadow: 'none'}}>Remove</button></div>
                            <div className="btn-wrap">
                              <button disabled={this.state.submitting} type="submit" className="btn primary flex align-c" style={{paddingTop: '7px', paddingBottom: '7px'}}>
                                {
                                  this.state.submitting 
                                  ?
                                  <InternalLoader message='Uploading...' />
                                  : 
                                  <>
                                  <span className="icon stroke-light" role="img">
                                    <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                      <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                                      <polyline points="9 15 12 12 15 15" />
                                      <line x1={12} y1={12} x2={12} y2={21} />
                                    </svg>
                                  </span>
                                  <span className="p-lr-5">Upload</span>
                                  </>
                                }
                              </button>
                          </div>
                          </form>
                      </div>
                  </div>
                </div>
            </div>
          </section>
          {this.props.notifier && <Noitifier />}
        </div>
        </>
      )
  }
}

export default Upload;
