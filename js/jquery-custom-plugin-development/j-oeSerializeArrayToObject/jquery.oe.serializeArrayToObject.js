jQuery.fn.serializeArrayToObject = function(d){
    var o = {};
    if(!d) d = this.serializeArray();
    jQuery.each(d, function() {
        if (o[this.name]) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};