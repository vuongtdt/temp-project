import * as momentTimeZone from 'moment-timezone';
export const formatNumber = (
    value: any,
    includeDecimal: boolean = true,
    decimal: number = 2
) => {
    if (!value) return '0 đ';
    if (includeDecimal) {
        value = parseFloat(value).toFixed(decimal);
    }
    value += "";
    const list = value.split(".");
    const prefix = list[0].charAt(0) === "-" ? "-" : "";
    let num = prefix ? list[0].slice(1) : list[0];
    let result = "";
    while (num.length > 3) {
        result = `,${num.slice(-3)}${result}`;
        num = num.slice(0, num.length - 3);
    }
    if (num) {
        result = num + result;
    }
    if (includeDecimal && parseInt(list[1]) > 0) {
        return `${prefix}${result}${list[1] ? `.${list[1]}` : ""}`;
    }

    return `${prefix}${result} đ`;
};

export const formatDate = (
    time: any,
    format: string = "HH:mm DD-MM-YYYY"
) => {
    return momentTimeZone.tz(time, "Asia/Bangkok").format(format);

};

export const phoneRegExp = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
export const weightRegExp = /^(?:[1-9]\d{0,2}(?:,\d{3})*|0)(?:\.\d+)?$/;

export const createQueryParams = (params: any) => {
    return Object.keys(params).map((param) => {
        if (params[param]?.length > 0) {
            return params[param].map(p => param + '=' + p)
        } else if (params[param] || params[param] === false) {
            return param + '=' + params[param];
        } else {
            return null;
        }
    }).filter((param) => param !== undefined && param !== null).join('&');

}
export const parseObjectArrayToParam = (obj: Object) => {
    let path = ''
    Object.keys(obj).map(key => {
        if ((obj[key] !== undefined || obj[key] === 0) && obj[key] !== null) {
            if (!Array.isArray(obj[key])) {
                return path += '&' + key + '=' + encodeURIComponent(obj[key]);
            } else {
                if (obj[key].length === 1) {
                    return path += '&' + key + '=' + encodeURIComponent(obj[key][0]);
                } else if (obj[key].length > 1) {
                    obj[key].map(ob => {
                        return path += '&' + key + '=' + encodeURIComponent(ob);
                    })
                }
            }
            return path;
        } else return path;
    })
    path = path.substring(1)
    return path
}
export const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

export const imageToUrl = (file) => {
    // var input = file.target;
    var reader = new FileReader();
    reader.onload = function () {
        return reader.result;
    };
    // reader.readAsDataURL(input.files[0]);
};
export const debounce = (func, timeout = 300) => {
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
}
function stringToColor(string: string) {
    if (!string) {
        return '#5a2d8d';
    }

    let hash = 0;
    for (let i = 0; i < string.length; i++) {
        hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';
    for (let i = 0; i < 3; i++) {
        const value = (hash >> (i * 8)) & 0xff;
        color += `00${value.toString(16)}`.slice(-2);
    }

    return color;
}
export const stringAvatar = (name: string) => {
    const initials = name?.split(' ')?.length > 1
        ? (name
            ?.split(' ')
            .map((part) => part[0])
            .join('') || '--')
            ?.slice(0, 2)
        : name?.slice(0, 2) || '--';

    return {
        sx: {
            bgcolor: stringToColor(name),
        },
        children: initials,
    };
};
