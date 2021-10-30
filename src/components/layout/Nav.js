import { Component } from "react";
import PropTypes from "prop-types";

import { dropDown, handleSidebar } from "../../utils/funcs";

export default class Nav extends Component {

    render() {
        const { firstname, lastname, email } = this.props.user;
        return (
            <>
            <nav id="navBar">
                <div className="nav-bar__ctrl flex justify-b align-c">
                    <button onClick={handleSidebar.bind(this)} type="button" className="toggle-menu icon stroke" style={{background: 'transparent', border: 'none'}} aria-label="Toggle Menu">
                        <svg xmlns="http://www.w3.org/2000/svg" width={30} height={30} view-box="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                            <line x1={4} y1={6} x2={20} y2={6} />
                            <line x1={4} y1={12} x2={20} y2={12} />
                            <line x1={4} y1={18} x2={20} y2={18} />
                        </svg>
                    </button>
                    <div className="flex align-c">
                    <ul className="flex align-c">
                        <li className="position-r" style={{padding: 0}}>
                            <div onClick={dropDown.bind(this)} className="icon" style={{border: '1px solid var(--border-color)'}} data-dropdown="true" title="User">
                                <img className="profile-image-img" src="/assets/media/icons/avatar.svg" alt="User icon" />
                            </div>
                            <div onClick={e => e.stopPropagation()} className="drop-down b-rad-5 custom-scroll" data-dropdown-hidden="true">
                                <ul className="p-tb-10">
                                    <li style={{borderBottom: '1px solid var(--border-color)'}}>
                                        <div className="p-10 flex align-c f-16">
                                        <div className="icon" style={{width: '50px', height: '50px', border: '1px solid var(--border-color)'}}>
                                            <img className="profile-image-img" src="/assets/media/icons/avatar.svg" alt="User icon" />
                                        </div>
                                        <div className="m-l-10 f-10 text-break" style={{maxWidth: 'calc(100% - 50px - 10px)'}}>
                                            <p className="text-cap f-w-6">
                                                {firstname + ' ' + lastname}
                                            </p>
                                            <p className="text-mute m-t-5">
                                                {email}
                                            </p>
                                        </div>
                                        </div>
                                    </li>
                                    <li className="hover-effect" style={{borderBottom: '1px solid var(--border-color)'}}>
                                        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                                        <a href="#" onClick={this.props.logout} style={{textDecoration: 'none', color: '#000000', fontSize: '12px'}}>
                                            <div className="p-lr-10 p-tb-5 flex align-c f-14 text-icon">
                                                <div className="icon stroke">
                                                    <svg xmlns="http://www.w3.org/2000/svg" width={32} height={32} viewBox="0 0 24 24" strokeWidth="1.5" stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                                        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                        <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
                                                        <path d="M7 12h14l-3 -3m0 6l3 -3" />
                                                    </svg>
                                                </div>
                                                <p className="m-l-10">Logout</p>
                                            </div>
                                        </a>
                                    </li>
                                    <li className="p-t-5">
                                        <div className="p-lr-10 p-tb-5 flex justify-c align-c" style={{fontSize: '10px'}}>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                    </div>
                </div>
            </nav>
            </>
        );
    }
}

Nav.propTypes = {
    user: PropTypes.object.isRequired,
    logout: PropTypes.func.isRequired
}