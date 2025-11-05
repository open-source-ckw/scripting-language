/**
 @file : jquery.oe.ondependent.js
 @plugin : jOnDependent
 @description : This plugin load data based on its parent field's data selected by user
 @dependent : jAjaxCall | selectize
 **/
;(function() {
    (function($) {
        var pBI = "jODPBI";
        jQuery.jOnDependent = function(element, options) {
            var _this = this;

            this.element = element;
            this.$element = jQuery(element);
            this.$element.data(pBI, this);

            this.init = function(){
                _this._o = jQuery.extend({}, jQuery.jOnDependent._oDefault, options);
                _this.bound_element = _this.$element;

                if(!jQuery().selectize || !jQuery().selectize)
                {
                    console.log("Plugin : jOnDependent => Dependent jQuery plugins not found. Please load below dependent plugins in same order.");
                    console.log("jAjaxCall => "+typeof jQuery().jAjaxCall);
                    console.log("selectize => "+typeof jQuery().selectize);
                    _this.bound_element.data(pBI,null);
                    return false;
                }

                _this.loading = false;
                _this.history = '';
                _this.e_list = {};
                _this.total_ele= jQuery('['+_this._o.a_e_index+']').length;

                if(_this.total_ele <= 1){return false;}

                _this.ManipulateElement();
                _this.BindAutoSuggestion();

                _this._o.fn_on_init(this);
                return _this;
            };
            this.inactive = function(){
                _this.bound_element.data(pBI,null);
            };
            this.ManipulateElement = function(){
                for(var i=1; i<=_this.total_ele; i++){_this.e_list[i] = '['+_this._o.a_e_index+'="'+i+'"]';}
            },
            this.RestSuggestion = function(i){
                var j = parseFloat(i)+1;
                if(jQuery(_this.e_list[j]).length == 1){
                    jQuery(_this.e_list[j])[0].selectize.clearOptions();
                }
            };
            this.RefreshSuggestion = function(i){
                if(jQuery(_this.e_list[i]).length == 1){
                    jQuery(_this.e_list[i])[0].selectize.refreshOptions();
                    _this.RestSuggestion(i);
                }
            };
            this.BindAutoSuggestion = function(){
                jQuery.each(_this.e_list,function(i,s){
                    var onC={};
                    onC.t = jQuery(s);
                    if(onC.t.length == 1){
                        onC.i = i;
                        onC.s = s;
                        if(onC.t.attr(_this._o.a_create) == 'true'){onC.a_create=true;}else{onC.a_create=false;}
                        onC.t.off('selectize');
                        onC.t.selectize({
                            valueField  :   _this._o.valueField,
                            labelField  :   _this._o.labelField,
                            searchField :   _this._o.searchField,
                            sortField   :   _this._o.sortField,
                            persist     :   false,
                            create      :   onC.a_create,
                            load: function (q, callback) {
                                if (!q.trim()) {return callback();}

                                onC.send_data = [{name:'q',value:q}];
                                if(i != 1){
                                    onC.p_i = i-1;
                                    onC.p_e = jQuery(_this.e_list[onC.p_i]);
                                    onC.p_id = onC.p_e.val();
                                    onC.p_name = onC.p_e.attr('name');
                                    onC.p_title = onC.p_e.next('.selectize-control').find('.selectize-input').find('[data-value="' +onC.p_id+ '"]').text();
                                    if (onC.p_id=='' || onC.p_id==onC.p_title) return callback();

                                    onC.send_data.push({name:'pid',value:onC.p_id});
                                }
                                onC.name = onC.t.attr('name');
                                onC.send_data.push({name:'name',value:onC.name});
                                jQuery.jAjaxCall({
                                    send_data: onC.send_data,
                                    xhr_area: _this._o.xhr_area,
                                    xhr_module: _this._o.xhr_module,
                                    xhr_action: _this._o.xhr_action,
                                    xhr_url: _this._o.xhr_url,
                                    xhr_method: "POST",
                                    xhr_timeout: (1000 * 5),
                                    xhr_cache: false,
                                    xhr_data_type: "json",
                                    xhr_cross_domain: true,
                                    xhr_with_credentials: true,
                                    skip_pr: false,
                                    fn_alert: _this._o.fn_alert,
                                    callbefore_send: function (jqXHR, settings) {
                                        Loading = true;
                                        _this._o.callbefore_send(onC, jqXHR, settings);
                                    },
                                    callback_on_success: function (data, textStatus, jqXHR) {
                                        if(data.DATA){callback(data.DATA);}
                                        _this._o.callback_on_success(onC, data, textStatus, jqXHR);
                                    },
                                    callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                        callback();
                                        _this._o.callback_on_error(onC, jqXHR, textStatus, errorThrown);
                                    },
                                    callback_on_complete: function (jqXHR, textStatus) {
                                        _this._o.callback_on_complete(onC, jqXHR, textStatus);
                                        Loading = false;
                                    }
                                }, _this.bound_element.attr('id'));
                            },
                            onChange: function (e) {
                                _this.RestSuggestion(onC.i);
                            }
                        });
                    }
                });
            };
            return this.init();
        };
        jQuery.jOnDependent._oDefault = {
            a_e_index   :   'data-ondependent',/*Attribute name which hold index number of element so plugin can get dependent order*/
            a_create    :   'data-create',/*Attribute name which hold whether to allow create new option or must force to select from suggested list*/

            valueField  :   'id',
            labelField  :   'label',
            searchField :   'search',
            sortField   :   'sort',

            xhr_area    :   '',
            xhr_module  :   '',
            xhr_action  :   '',
            xhr_url     :   '',
            fn_alert    :   function(mt,m){},
            callbefore_send     :   function(onC, jqXHR, settings){},
            callback_on_success :   function(onC, data, textStatus, jqXHR){},
            callback_on_error   :   function(onC, jqXHR, textStatus, errorThrown){},
            callback_on_complete:   function(onC, jqXHR, textStatus){},

            fn_on_init : function(e){}/*Any process at the time of initialization*/
        };
        jQuery.fn.jOnDependent = function(options){
            return jQuery.each(this, function(i, element){
                var $element;
                $element = jQuery(element);
                if($element.length > 0){
                    if (!$element.data(pBI) || $element.data(pBI) == null || $element.data(pBI) == ''){
                        $element.data(pBI, new jQuery.jOnDependent(element, options));
                    }
                }
            });
        };
        return void 0;
    })(jQuery);
}).call(this);