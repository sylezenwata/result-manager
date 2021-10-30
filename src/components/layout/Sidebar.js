import { Component } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

import config from "../../utils/config";
import { handleSidebar } from "../../utils/funcs";

export default class Sidebar extends Component {
    render() {
        return(
            <>
            <aside data-sdiebar-wrapper>
                <div id="sideBar" className="custom-scroll">
                    <div className="sideBar__wrap flex flex-col justify-b">
                        <div>
                            <div className="nav-bar__side flex align-c">
                                <div className="logo">
                                    <img src="/assets/media/images/logo.png" alt={`${config.ORG_SHORT} logo`} />
                                </div>
                                <h1 className="m-l-10 f-16">{config.APP_NAME}</h1>
                            </div>
                            <ul className="sideBar__list">
                                <li className="list-item" data-active={this.props.path === '/dashboard'}>
                                    <Link to="/dashboard" onClick={handleSidebar.bind(this)}>
                                        <div className="flex align-c" style={{padding: '7px 10px'}}>
                                            <span className="icon stroke" role="img">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <polyline points="5 12 3 12 12 3 21 12 19 12" />
                                                    <path d="M5 12v7a2 2 0 0 0 2 2h10a2 2 0 0 0 2 -2v-7" />
                                                    <rect x={10} y={12} width={4} height={4} />
                                                </svg>
                                            </span>
                                            <span className="position-r">Dashboard</span>
                                        </div>
                                    </Link>
                                </li>
                                <li className="list-item" data-active={this.props.path === '/upload'}>
                                    <Link to="/upload" onClick={handleSidebar.bind(this)}>
                                        <div className="flex align-c" style={{padding: '7px 10px'}}>
                                            <span className="icon stroke" role="img">
                                                <svg xmlns="http://www.w3.org/2000/svg" width={44} height={44} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                    <path d="M7 18a4.6 4.4 0 0 1 0 -9a5 4.5 0 0 1 11 2h1a3.5 3.5 0 0 1 0 7h-1" />
                                                    <polyline points="9 15 12 12 15 15" />
                                                    <line x1={12} y1={12} x2={12} y2={21} />
                                                </svg>
                                            </span>
                                            <span className="position-r">upload</span>
                                        </div>
                                    </Link>
                                </li>
                                {/* <div className="custom-hr" style={{margin: '10px', width: 'unset'}}><span className="f-12 f-w-6 p-lr-10 position-a" style={{top: '50%', backgroundColor: 'var(--bg-color)', color: 'var(--text-color)', left: '50%', transform: 'translate(-50%, -50%)'}}>Admin</span></div> */}
                            </ul>
                        </div>
                        <div className="position-r m-t-20">
                            <p className="text-c f-10 f-w-6 p-10 text-mute">Version 1.2.0</p>
                        </div>
                    </div>
                </div>
                <div id="sideBarOverlay" className="overlay"></div>
            </aside>
            </>
        );
    }
}

Sidebar.propTypes = {
    path: PropTypes.string.isRequired,
}