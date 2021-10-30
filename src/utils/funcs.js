import SET from '../vendors/set';

/**
 * get or set user data to sessionStorage
 * @param {Object} user 
 * @returns void
 */
export const sessionUser = (user = null) => {
    if (!user) {
        let user = sessionStorage.getItem('user');
        return JSON.parse(user);
    }
    sessionStorage.setItem('user', JSON.stringify(user));
};

/**
 * get or set auth token to sessionStorage
 * @param {Object} tokens 
 * @param {String} type 
 * @returns void
 */
export const sessionToken = (tokens, type = null) => {
    if (!tokens) {
        let token = sessionStorage.getItem(type);
        return JSON.parse(token);
    }
    let { access, refresh } = tokens;
    sessionStorage.setItem('access', JSON.stringify(access))
    sessionStorage.setItem('refresh', JSON.stringify(refresh));
};

/**
 * function to remove auth properties from sessionStorage
 */
export const clearAuthStore = async () => {
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('access');
    sessionStorage.removeItem('refresh');
}

/**
 * function to handle window click events
 * @param {String} event 
 * @param {Function} func 
 */
export const winClick = (event, func) => {
    window.on(event, (e) => {e.preventDefault(); func();}, {once: true});
}

/**
 * function to validate a tring with regex
 * @param {String|Atring[]} data 
 * @param {*} regex 
 * @returns 
 */
export const validateData = (data, regex) => {
    let dataIsArray = Array.isArray(data);
    let newData = [];
    data = dataIsArray ? data : [data];
    data.forEach(element => {
        if (regex.test(element)) {
            newData.push(element);
        }
    });
    return dataIsArray ? (newData.length > 0 ? newData : false) : (newData.length > 0 ? newData[0] : false);
}

/**
 * function to file input and return reader result
 * @param {*} file 
 */
export const fileReader = async (file) => {
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
        return reader.result;
    }
}

/**
 * function to handle dropdown
 * @param {Event} e 
 */
export const dropDown = (e) => {
    e.stopPropagation();
    // val if clicked dropdown is active close
    if (SET.$('[data-dropdown-hidden="false"]') && e.currentTarget.getSibling(null,'[data-dropdown-hidden="false"]')) {
        return view(null);
    }
    // val if there is another active dropdown and close
    if (SET.$('[data-dropdown-hidden="false"]') && !e.currentTarget.getSibling(null,'[data-dropdown-hidden="false"]')) {
        view(null);
    }
    // show dropdown
    view(e);
    // display dropdown
    function view(ev) {
        let drpDwn;
        if (!ev) {
            drpDwn = SET.$('[data-dropdown-hidden="false"]')
            if (drpDwn) {
                drpDwn.data('dropdown-hidden', 'true');
            }
            return;
        }
        drpDwn = e.currentTarget.getSibling(null,'[data-dropdown-hidden]');
        drpDwn.data('dropdown-hidden', `${!JSON.parse(drpDwn.data('dropdown-hidden'))}`);
        winClick('click', () => view(null));
    }
}

/**
 * function to show xss attack warning
 */
export const xssWarning = () => {
    console.log('%cWARNING!', 'background: #ff0; color: #f00; font-size: 25px; font-weight: 600');
    console.log('%cUsing this console may allow attackers to impersonate you and steal your information using an attack called Self-XSS.Do not enter or paste code that you do not understand.', 'font-size: 18px; font-weight: 600');
};

/**
 * function to handle sidebar
 */
export const handleSidebar = () => {
    if (SET.checkDeviceWidth() <= 1025) {
        const sideBar = SET.$("#sideBar");
        if (sideBar.classList.contains("active")) {
            SET.fixClass([sideBar,'#sideBarOverlay'], [['active'],['active']], [false,false]);
            setTimeout(() => {
                SET.fixClass([sideBar,'#sideBarOverlay'], [['set'],['set']], [false,false]);
            }, 350);
            return;
        }
        SET.fixClass([sideBar,'#sideBarOverlay'], [['set'],['set']], [true,true]);
        setTimeout(() => {
            SET.fixClass([sideBar,'#sideBarOverlay'], [['active'],['active']], [true,true]);
        }, 100);
        SET.$("#sideBarOverlay").on("click", handleSidebar, {once: true});
    }
}
