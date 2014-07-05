exports.slugSession = function(text){
    return text
        .replace(/\./g,'')
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '');
};
/**
 * Capitalize the first character of a string
 */
exports.capitaliseFirstLetter = function(string) {
    if(string)
        return string.charAt(0).toUpperCase() + string.slice(1);
    else {
        return "";
    }
};

exports.getExpiresDate = function(){
    return new Date();
}

/* Date Formatter */
exports.dateFormat = function (date, fstr, utc) {
  utc = utc ? 'getUTC' : 'get';
  return fstr.replace (/%[YmdHMS]/g, function (m) {
    switch (m) {
    case '%Y': return date[utc + 'FullYear'] (); // no leading zeros required
    case '%m': m = 1 + date[utc + 'Month'] (); break;
    case '%d': m = date[utc + 'Date'] (); break;
    case '%H': m = date[utc + 'Hours'] (); break;
    case '%M': m = date[utc + 'Minutes'] (); break;
    case '%S': m = date[utc + 'Seconds'] (); break;
    default: return m.slice (1); // unknown code, remove %
    }
    // add leading zero if required
    return ('0' + m).slice (-2);
  });
}

/*Get distinct values in array*/
exports.getUnique = function(arr){
   var u = {}, a = [];
   for(var i = 0, l = arr.length; i < l; ++i){
      if(u.hasOwnProperty(arr[i])) {
         continue;
      }
      a.push(arr[i]);
      u[arr[i]] = 1;
   }
   return a;
}
exports.removeFromArray = function(array, element){
	if(!array || !element){
		return;
	}
	var index = array.indexOf(element);
	array.splice(index, 1);
	return array;
}