import React, { Component } from "react";
import { Helmet } from "react-helmet";

import config from '../../utils/config';

class NotFound extends Component {
    
    render() {
        return (
            <>
            <Helmet>
                <title>404 - {config.APP_NAME}</title>
            </Helmet>
            <div className="content flex">
                <div className="main-panel p-tb-20 flex flex-col justify-c">
                    <div className="text-c flex flex-col align-c">
                        <h2 className="f-25 p-tb-10 f-w-6" style={{borderBottom: '1px solid var(--border-color)'}}>404</h2>
                        <p className="f-14 m-t-10">The requested path could not be found</p>
                    </div>
                </div>
            </div>
            </>
        );
    }
}

export default NotFound;