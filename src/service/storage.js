const storageKey = {
    USER_LIST: "searchUser",
    PROJECT_LIST: "searchProject",
    USER_SETTINGS: "userSettings",
    SCORE_MODE: "scoreMode"
}

const storageService = function (key, value) {
    function isEmpty(value) {
        return typeof (value) === undefined || typeof (value) === null;
    }

    function get(key) {
        return localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
    }

    function set(key, value) {
        const valueToStore = Array.isArray(value) ? value : [value];
        localStorage.setItem(key, JSON.stringify(valueToStore));
    }

    return {
        get: get,
        getFirst: function (key) {
            let result = isEmpty(get(key)) ? null : get(key);
            result = result != null ? result[0] : null;
            return result;
        },
        set: function (key, value) {
            if (isEmpty(value) === true) {
                localStorage.removeItem(key);
            }
            set(key, value);
        },
        add: function (key, value) {
            let temp = get(key);
            if (isEmpty(key) || isEmpty(value)) {
                console.warn('storageService.add(): \'key\' is not defined / stored');
                return false;
            }
            if (temp === null) {
                set(key, value);
                return false;
            }

            temp = temp.filter(item => item.id !== value.id);
            temp.unshift(value);

            set(key, temp);
        },
        remove: function (key, value) {
            let temp = get(key);
            if (isEmpty(key) || isEmpty(value)) {
                console.warn('storageService.remove(): \'key\' is not defined / stored');
                return false;
            }
            if (temp === null) {
                return false;
            }
            temp = temp.filter(item => item.id !== value);
            set(key, temp);
        }
    }
}();

export { storageService, storageKey };