/**
 @file           :   jquery.oe.ajaxrequest.js
 @plugin         :   jAjaxCall
 @description    :   Make request to server asynchronous and manipulate as per server response
 @dependent      :   Plugin is not dependent on any other plugin.
 @caution        :   Pass send_data param in serializeArray format only.

 How to make a call with plugin.
 jQuery.jAjaxCall({
    xhr_area    :   'RequestedAreaName',
    xhr_module  :   'ModuleName',
    xhr_action  :   'ActionName',
    send_data    :   [{name: 'page', value: 7},{name: 'view', value:'list'}],
    xhr_url     :   'URL to send request',
});
 **/
;if(typeof Loading == 'undefined'){Loading=false}
(function() {
    (function($) {
        jQuery._jAjaxCall = function(options) {
            var _this = this;

            _this.loading = false;

            this.init = function(options){
                if(_this.loading === false && Loading === false)
                {
                    _this._o = jQuery.extend({}, jQuery._jAjaxCall.defaultOptions, options);

                    _this.XHR       =   'XHR';
                    _this.XHR_URL   =   'URL';
                    _this.XHR_AJAX  =   'AJAX';
                    _this.XHR_AREA  =   'AREA';
                    _this.XHR_MODULE=   'MODULE';
                    _this.XHR_ACTION=   'ACTION';
                    _this.XHR_R_ASSIGN  =   'ASSIGN';
                    _this.XHR_R_APPEND  =   'APPEND';
                    _this.XHR_R_PREPEND =   'PREPEND';
                    _this.XHR_R_SCRIPT  =   'SCRIPT';
                    _this.XHR_R_REDIRECT=   'REDIRECT';
                    _this.XHR_R_ERROR   =   'ERROR';
                    _this.XHR_R_SUCCESS =   'SUCCESS';

                    _this.jAjaxRequest();

                    return _this;
                }
            };
            this.jAjaxRequest = function(){
                _this.send_data = _this._o.send_data;
                _this.send_data.push({name: _this.XHR+'['+_this.XHR_AJAX+']', value: true});
                _this.send_data.push({name: _this.XHR+'['+_this.XHR_URL+']', value: window.location.href});
                _this.send_data.push({name: _this.XHR+'['+_this.XHR_AREA+']', value: _this._o.xhr_area});
                _this.send_data.push({name: _this.XHR+'['+_this.XHR_MODULE+']', value: _this._o.xhr_module});
                _this.send_data.push({name: _this.XHR+'['+_this.XHR_ACTION+']', value: _this._o.xhr_action});
                jQuery.ajax({
                    url         :   _this._o.xhr_url,
                    method      :   _this._o.xhr_method,
                    /*contentType :   _this._o.xhr_content_type,*/
                    dataType    :   _this._o.xhr_data_type,
                    data        :   _this.send_data,
                    timeout     :   _this._o.xhr_timeout,
                    crossDomain :   _this._o.xhr_cross_domain,
                    cache       :   _this._o.xhr_cache,
                    xhrFields: {
                        withCredentials: _this._o.xhr_with_credentials
                    },
                    beforeSend  :   function(jqXHR, settings){
                        _this.loading = true;

                        _this._o.callbefore_send(jqXHR, settings);
                    },
                    success     :   function(data, textStatus, jqXHR){
                        if(_this._o.skip_pr === false){_this.ProcessResponse(data);}
                        _this._o.callback_on_success(data, textStatus, jqXHR);
                    },
                    error       :   function(jqXHR, textStatus, errorThrown) {
                        _this._o.callback_on_error(jqXHR, textStatus, errorThrown);
                    },
                    complete    :   function(jqXHR, textStatus){
                        if(textStatus == 'timeout'){_this._o.fn_alert('error','Server is too busy to process your request or your internet connect might be slow. Please wait and try again or <a data-reload="cc" href="javascript:void(0);">reload</a>.');}
                        else if(textStatus === 'parsererror'){_this._o.fn_alert('error','Server is too busy so, your request has been terminated. Please try again or <a data-reload="cc" href="javascript:void(0);">reload</a>.');}
                        _this._o.callback_on_complete(jqXHR, textStatus);
                        _this.loading = false;
                    },
                    statusCode  :   {
                        404:function(){
                            _this._o.fn_alert('error','404 : Requested page not found.');
                        }
                    }/*,
                     headers     :   {}*/

                });

                /*else{_this.fn_alert('warning','Please wait. Your request is in process.');}*/
            };
            this.ProcessResponse = function(data){
                if(data[_this.XHR_R_ASSIGN])
                {
                    jQuery.each(data[_this.XHR_R_ASSIGN], function(k,rd){
                        jQuery(rd[0]).html(rd[1]);
                    });
                }
                if(data[_this.XHR_R_APPEND])
                {
                    jQuery.each(data[_this.XHR_R_APPEND], function(k,rd){
                        jQuery(rd[0]).append(rd[1]);
                    });
                }
                if(data[_this.XHR_R_PREPEND])
                {
                    jQuery.each(data[_this.XHR_R_PREPEND], function(k,rd){
                        jQuery(rd[0]).prepend(rd[1]);
                    });
                }
                if(data[_this.XHR_R_SCRIPT])
                {
                    jQuery.each(data[_this.XHR_R_SCRIPT], function(k,rd){
                        eval(rd);
                    });
                }
                if(data[_this.XHR_R_ERROR])
                {
                    jQuery.each(data[_this.XHR_R_ERROR], function(k,rd){
                        _this._o.fn_alert('error',rd);
                    });
                }
                if(data[_this.XHR_R_SUCCESS])
                {
                    jQuery.each(data[_this.XHR_R_SUCCESS], function(k,rd){
                        _this._o.fn_alert('success',rd);
                    });
                }
                if(data[_this.XHR_R_REDIRECT])
                {
                    jQuery.each(data[_this.XHR_R_REDIRECT], function(k,rd){
                        if(rd[0])
                        {
                            if(rd[1] && isNaN(rd[1]) === false)
                            {
                                setTimeout(function(){
                                    window.location = rd[0];
                                },rd[1]);
                            }
                            else
                            {
                                window.location = rd[0];
                            }
                        }
                    });
                }
            };
        };
        jQuery._jAjaxCall.defaultOptions = {
            send_data   :   {},
            xhr_area    :   "",
            xhr_module  :   "",
            xhr_action  :   "",
            xhr_url     :   "",
            xhr_method  :   "POST",/*POST, GET, PUT*/
            xhr_timeout :   (1000*5),
            xhr_cache   :   false,
            xhr_data_type   :   "json", /*xml, json, script, html*/
            xhr_cross_domain:   true,
            xhr_with_credentials: true,
            /*xhr_content_type:   "application/x-www-form-urlencoded+; charset=UTF-8",*//*application/x-www-form-urlencoded | multipart/form-data | text/plain */
            skip_pr     :   false,
            callbefore_send     :   function(jqXHR, settings){},
            callback_on_success :   function(data, textStatus, jqXHR){},
            callback_on_error   :   function(jqXHR, textStatus, errorThrown){},
            callback_on_complete:   function(jqXHR, textStatus){},

            /**
             Show alert as user define
             @mt : alert, success, error, warning, info, confirm
             @m : Content of message. Will be plain text.
             **/
            fn_alert           :   function(mt, m){alert(m);},
        };
        jQuery.jAjaxCall = function(options,ajax_id){
            var element = jQuery('body');
            if(element.length > 0){
                if (!element.data(ajax_id) || element.data(ajax_id) == null || element.data(ajax_id) == ''){
                    element.data(ajax_id, new jQuery._jAjaxCall(options));
                }
                return element.data(ajax_id).init(options);
            }
        };
        jQuery.fn.jAjaxCall = function(){};
        return void 0;
    })(jQuery);
}).call(this);