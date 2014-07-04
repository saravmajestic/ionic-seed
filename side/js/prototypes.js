Array.prototype.pushAll = function (array) {
    array.forEach(function(x) {this.push(x)}, this);    
};