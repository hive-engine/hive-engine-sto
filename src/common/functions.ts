import { transform, isEqual, isObject } from 'lodash';

export function queryParam( ary ) {
    return Object.keys( ary ).map( function( key ) {
        if ( Array.isArray( ary[key] ) ) {
            let arrayParts = [];

            for (let i = 0; i < ary[key].length; i++ ) {
                arrayParts.push( encodeURIComponent( key + '[]' ) + '=' + encodeURIComponent( ary[key][i] ) );
            }
            
            return arrayParts.join( '&' );
        }
        return encodeURIComponent( key ) + '=' + encodeURIComponent( ary[key] );
    }).join('&');
}

export function addCommas(nStr, currency?) {
    nStr += '';
    
	const x = nStr.split('.');
	let x1 = x[0];
	let x2 = x.length > 1 ? '.' + x[1] : '';
    let rgx = /(\d+)(\d{3})/;
    
	while (rgx.test(x1)) {
		x1 = x1.replace(rgx, '$1' + ',' + '$2');
	}

	if (x2 == '' && currency == 1) {
        x2 = '.00';
    }

	return x1 + x2;
}

export function largeNumber(val) {
	val = parseFloat(val);
	
	if (val >= 1000000000000) {
        return addCommas(+(val / 1000000000000).toFixed(0)) + ' T';
    } else if(val >= 1000000000) {
        return addCommas(+(val / 1000000000).toFixed(3)) + ' B';
    } else if(val >= 1000000) {
        return addCommas(+(val / 1000000).toFixed(3)) + ' M';
    } else {
        return addCommas(+val.toFixed(3));
    }
}

export function popupCenter(url, title, w, h) {
    const dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    const dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    const width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    const height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    const systemZoom = width / window.screen.availWidth;
    const left = (width - w) / 2 / systemZoom + dualScreenLeft
    const top = (height - h) / 2 / systemZoom + dualScreenTop
    const newWindow = window.open(url, title, 'scrollbars=yes, width=' + w / systemZoom + ', height=' + h / systemZoom + ', top=' + top + ', left=' + left);

	if (window.focus) {
		newWindow.focus();
	}

	return newWindow;
}


export function tryParse(json) {
	try {
		return JSON.parse(json);
    } catch(err) { 
        return null; 
    }
}

/**
 * Deep diff between two object, using lodash
 * @param  {Object} object Object compared
 * @param  {Object} base   Object to compare with
 * @return {Object}        Return a new object who represent the diff
 */
export function difference(object, base) {
	return transform(object, (result, value, key) => {
		if (!isEqual(value, base[key])) {
			result[key] = isObject(value) && isObject(base[key]) ? difference(value, base[key]) : value;
		}
	});
}

export function sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}
