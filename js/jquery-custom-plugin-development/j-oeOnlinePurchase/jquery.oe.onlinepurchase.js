/**
 @file : jquery.oe.onlinepurchase.js
 @plugin : jOnlinePurchase
 @description : This plugin manage entire shopping cart and other actions related with listing item
 @dependent : serializeArrayToObject | jAjaxCall | bootbox | validate | selectize | jOnDependent
 **/
;(function () {
    (function ($) {
        var pBI = "jOPPBI";
        jQuery.jOnlinePurchase = function (element, options) {
            var _this = this;

            this.element = element;
            this.$element = jQuery(element);
            this.$element.data(pBI, this);

            this.init = function () {
                _this._o = jQuery.extend({}, jQuery.jOnlinePurchase._oDefault, options);
                _this.bound_element = _this.$element;

                if(!jQuery().serializeArrayToObject || !jQuery().jAjaxCall || typeof bootbox != 'object')
                {
                    console.log("Plugin : jOnlinePurchase => Dependent jQuery plugins not found. Please load below dependent plugins in same order.");
                    console.log("serializeArrayToObject => "+typeof jQuery().serializeArrayToObject);
                    console.log("jAjaxCall => "+typeof jQuery().jAjaxCall);
                    console.log("bootbox => "+typeof bootbox);
                    _this.bound_element.data(pBI, null);
                    return false;
                }

                _this.loading = false;
                _this.cur_step = _this._o.checkout.initial_step;
                _this.history = '';

                _this.init_listing_btn();
                _this.init_checkout();

                _this._o.fn_on_init(this);
                return _this;
            };
            this.inactive = function () {
                _this.bound_element.data(pBI, null);
            };
            this.set_in_checkout = function(d){
                if(d && _this._o.in_checkout === true){d.push({name:'in_checkout',value:'true'});}
                return d;
            };
            this.init_listing_btn = function(){
                jQuery.each(_this._o.listing.btn,function(k,d){
                    _this.BindListingButton(k,d);
                });
            };
            this.BindListingButton = function(k,ob){
                var e = jQuery(ob.s);
                if(e.length > 0){
                    e.off('click');
                    e.on('click',function() {
                        var onC = {};
                        onC.t = jQuery(this);
                        onC.ref_id = onC.t.parents(_this._o.listing.s_ref_id).attr(_this._o.listing.va_ref_id);
                        onC.ref_type = onC.t.parents(_this._o.listing.s_ref_type).attr(_this._o.listing.va_ref_type);
                        onC.ref_additional = onC.t.attr(_this._o.listing.va_ref_additional);
                        onC.s_div = '[' + _this._o.listing.va_ref_id + '="' + onC.ref_id + '"][' + _this._o.listing.va_ref_type + '="' + onC.ref_type + '"]';
                        onC.send_data = [{name: 'ref_id', value: onC.ref_id}, {name: 'ref_type', value: onC.ref_type},{name: 'ref_additional', value: onC.ref_additional}];

                        if (ob.check_rr && ob.check_rr === true){
                            var rr = onC.t.parents(_this._o.listing.s_ref_id).find(_this._o.listing.s_ref_required_div);
                            if (rr.length > 0 && rr.find(':input').length > 0) {
                                var er = false;
                                onC.ref_required = rr.find(':input').serializeArray();

                                if(onC.ref_required.length == 0){er = true;}
                                else{
                                    jQuery.each(onC.ref_required, function (k, i) {
                                        if (!i.value || i.value == '') {er = true;}
                                    });
                                }

                                if (er == true) {
                                    rr.css('box-shadow', '0 0 2px 3px rgba(244, 200, 25, 0.4)');
                                    rr.fadeOut().fadeIn().fadeOut().fadeIn().fadeOut().fadeIn();
                                    setTimeout(function () {rr.css('box-shadow', '');}, 2000);

                                    jQuery('span[for="'+ob.xhr_action+'"]').remove();
                                    onC.t.before('<span style="color:#e1bf0c;" for="'+ob.xhr_action+'">'+_this._o.msg.e.select_rd+'</div>');
                                    setTimeout(function(){jQuery('span[for="'+ob.xhr_action+'"]').remove();}, 1000*20);

                                    _this._o.listing.fn_notify('error', _this._o.msg.e.select_rd);
                                    return false;
                                }
                                else{jQuery.merge(onC.send_data, onC.ref_required);}
                            }
                        }

                        if(ob.xhr_action == _this._o.listing.btn.send_enquiry.xhr_action && _this._o.is_user_logged === false){
                            var se = jQuery(ob.s_se_div);
                            se.find('[name="ref_id"]').val(onC.ref_id);
                            se.find('[name="ref_type"]').val(onC.ref_type);
                            return true;
                        }

                        onC.send_data = _this.set_in_checkout(onC.send_data);

                        jQuery.jAjaxCall({
                            send_data       :   onC.send_data,
                            xhr_area        :   ob.xhr_area,
                            xhr_module      :   ob.xhr_module,
                            xhr_action      :   ob.xhr_action,
                            xhr_url         :   ob.xhr_url,
                            xhr_method      :   "POST",
                            xhr_timeout     :   (1000*5),
                            xhr_cache       :   false,
                            xhr_data_type   :   "json",
                            xhr_cross_domain:   true,
                            xhr_with_credentials: true,
                            skip_pr         :   false,
                            fn_alert        :   _this._o.listing.fn_notify,
                            callbefore_send :   function(jqXHR, settings){
                                Loading = true;
                                _this._o.listing.fn_ShowLoading(true,onC.s_div);
                                ob.callbefore_send(onC, jqXHR, settings);
                            },
                            callback_on_success: function(data, textStatus, jqXHR){
                                if(ob.xhr_action == _this._o.listing.btn.add_to_cart.xhr_action)
                                {
                                    _this.init_checkout();
                                }
                                else if(ob.xhr_action == _this._o.listing.btn.quick_view.xhr_action)
                                {
                                    _this.init_listing_btn();
                                }
                                else if(ob.xhr_action == _this._o.listing.btn.send_enquiry.xhr_action)
                                {
                                    e.remove();
                                }
                                ob.callback_on_success(onC, data, textStatus, jqXHR);
                            },
                            callback_on_error: function(jqXHR, textStatus, errorThrown){
                                ob.callback_on_error(onC, jqXHR, textStatus, errorThrown);
                            },
                            callback_on_complete: function(jqXHR, textStatus){
                                ob.callback_on_complete(onC, jqXHR, textStatus);
                                Loading = false;
                                _this._o.listing.fn_ShowLoading(false,onC.s_div);
                            }
                        },ob.xhr_action);
                    });
                }
            };
            this.init_checkout = function(){
                _this.BindEmptyCartCancelOrder();
                _this.BindRemoveItem();

                if(_this._o.in_checkout == false){return false;}

                if(!jQuery().validate || !jQuery().jOnDependent)
                {
                    console.log("Plugin : jOnlinePurchase => Dependent jQuery plugins not found. Please load below dependent plugins in same order.");
                    console.log("validate => "+typeof jQuery().validate);
                    console.log("selectize => "+typeof jQuery().selectize);
                    console.log("jOnDependent => "+typeof jQuery().jOnDependent);
                    return false;
                }

                _this.BindChangeItemQty();
                _this.BindShowOffer();
                _this.BindApplyOffer();
                _this.BindRemoveOffer();
                _this.BindNextPrevious();
                _this.BindGeoLocationForAddress();
                _this.BindAddressBook();
                _this.BindAddressSameAs();
                _this.BindChangeBilling();
                _this.BindChangeShipping();
            };
            this.BindEmptyCartCancelOrder = function(){
                _this._o.checkout.btn.empty_cart.confirm    = _this._o.msg.c.empty_cart;
                _this._o.checkout.btn.cancel_order.confirm  = _this._o.msg.c.cancel_order;
                var t=['empty_cart','cancel_order'];
                jQuery.each(t,function(k,v) {
                    var ob = _this._o.checkout.btn[v];
                    if(jQuery(ob.s).length > 0){
                        jQuery(ob.s).off('click');
                        jQuery(ob.s).on('click', function () {
                            bootbox.confirm(ob.confirm, function (result) {
                                if (result === true) {
                                    var send_data = [];
                                    send_data = _this.set_in_checkout(send_data);
                                    jQuery.jAjaxCall({
                                        send_data: send_data,
                                        xhr_area: ob.xhr_area,
                                        xhr_module: ob.xhr_module,
                                        xhr_action: ob.xhr_action,
                                        xhr_url: ob.xhr_url,
                                        xhr_method: "POST",
                                        xhr_timeout: (1000 * 5),
                                        xhr_cache: false,
                                        xhr_data_type: "json",
                                        xhr_cross_domain: true,
                                        xhr_with_credentials: true,
                                        skip_pr: false,
                                        fn_alert: _this._o.checkout.fn_notify,
                                        callbefore_send: function (jqXHR, settings) {
                                            Loading = true;
                                            ob.callbefore_send(jqXHR, settings);
                                        },
                                        callback_on_success: function (data, textStatus, jqXHR) {
                                            ob.callback_on_success(data, textStatus, jqXHR);
                                        },
                                        callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                            ob.callback_on_error(jqXHR, textStatus, errorThrown);
                                        },
                                        callback_on_complete: function (jqXHR, textStatus) {
                                            ob.callback_on_complete(jqXHR, textStatus);
                                            Loading = false;
                                        }
                                    }, ob.xhr_action);
                                }
                            });
                        });
                    }
                });
            };
            this.BindRemoveItem = function(){
                var ob = _this._o.checkout.btn.remove_item;
                if(jQuery(ob.s).length > 0)
                {
                    jQuery(ob.s).off('click');
                    jQuery(ob.s).on('click',function(){
                        var onC = {};
                        onC.t = jQuery(this);
                        onC.ref_id = onC.t.parents(_this._o.checkout.pi.s_purchase_id).attr(_this._o.checkout.pi.va_purchase_id);
                        onC.ref_type = onC.t.parents(_this._o.checkout.pi.s_purchase_type).attr(_this._o.checkout.pi.va_purchase_type);
                        onC.s_div = '[' + _this._o.checkout.pi.va_purchase_id + '="' + onC.ref_id + '"][' + _this._o.checkout.pi.va_purchase_type + '="' + onC.ref_type + '"]';
                        onC.send_data = [{name: 'ref_id', value: onC.ref_id}, {name: 'ref_type', value: onC.ref_type}];
                        onC.send_data = _this.set_in_checkout(onC.send_data);
                        jQuery.jAjaxCall({
                            send_data: onC.send_data,
                            xhr_area: ob.xhr_area,
                            xhr_module: ob.xhr_module,
                            xhr_action: ob.xhr_action,
                            xhr_url: ob.xhr_url,
                            xhr_method: "POST",
                            xhr_timeout: (1000 * 5),
                            xhr_cache: false,
                            xhr_data_type: "json",
                            xhr_cross_domain: true,
                            xhr_with_credentials: true,
                            skip_pr: false,
                            fn_alert: _this._o.checkout.fn_notify,
                            callbefore_send: function (jqXHR, settings) {
                                Loading = true;
                                jQuery(onC.s_div).fadeOut().fadeIn();
                                ob.callbefore_send(jqXHR, settings);
                            },
                            callback_on_success: function (data, textStatus, jqXHR) {
                                _this.init_checkout();
                                ob.callback_on_success(data, textStatus, jqXHR);
                            },
                            callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                ob.callback_on_error(jqXHR, textStatus, errorThrown);
                            },
                            callback_on_complete: function (jqXHR, textStatus) {
                                ob.callback_on_complete(jqXHR, textStatus);
                                Loading = false;
                            }
                        }, ob.xhr_action);
                    });
                }
            };
            this.BindChangeItemQty = function(){
                var ob = _this._o.checkout.btn.change_item_qty;
                if(jQuery(ob.s).length > 0)
                {
                    jQuery(ob.s).off('click');
                    jQuery(ob.s).on('click',function(){
                        var onC = {};
                        onC.t = jQuery(this);
                        onC.ref_id = onC.t.parents(_this._o.checkout.pi.s_purchase_id).attr(_this._o.checkout.pi.va_purchase_id);
                        onC.ref_type = onC.t.parents(_this._o.checkout.pi.s_purchase_type).attr(_this._o.checkout.pi.va_purchase_type);
                        onC.s_div = '[' + _this._o.checkout.pi.va_purchase_id + '="' + onC.ref_id + '"][' + _this._o.checkout.pi.va_purchase_type + '="' + onC.ref_type + '"]';

                        onC.ref_title = jQuery(onC.s_div).find(_this._o.checkout.pi.s_title).text();
                        onC.ref_req_quantity_old = jQuery(onC.s_div).find(_this._o.checkout.pi.s_qty).attr('value');
                        onC.ref_req_quantity = jQuery(onC.s_div).find(_this._o.checkout.pi.s_qty).val();
                        onC.ref_max_qty = jQuery(onC.s_div).find(_this._o.checkout.pi.s_max_oq).val();
                        onC.ref_min_qty = jQuery(onC.s_div).find(_this._o.checkout.pi.s_min_oq).val();

                        var e=false;
                        if(isNaN(onC.ref_req_quantity)==true || isNaN(onC.ref_max_qty)==true || isNaN(onC.ref_min_qty)==true){_this._o.checkout.fn_notify('error',onC.ref_title+' : '+_this._o.msg.e.invalid_qty);e=true;}
                        if(onC.ref_req_quantity > onC.ref_max_qty){_this._o.checkout.fn_notify('error',onC.ref_title+' : '+_this._o.msg.e.max_qty_only+' '+onC.ref_max_qty+'.');e=true;}
                        if(onC.ref_req_quantity < onC.ref_min_qty){_this._o.checkout.fn_notify('error',onC.ref_title+' : '+_this._o.msg.e.min_qty_required+' '+onC.ref_min_qty+'.');e=true;}

                        if(e == true){jQuery(onC.s_div).find(_this._o.checkout.pi.s_qty).val(onC.ref_req_quantity_old); return false;}

                        onC.send_data = [{name: 'ref_id', value: onC.ref_id}, {name: 'ref_type', value: onC.ref_type},{name: 'ref_req_quantity', value: onC.ref_req_quantity}];
                        onC.send_data = _this.set_in_checkout(onC.send_data);
                        jQuery.jAjaxCall({
                            send_data: onC.send_data,
                            xhr_area: ob.xhr_area,
                            xhr_module: ob.xhr_module,
                            xhr_action: ob.xhr_action,
                            xhr_url: ob.xhr_url,
                            xhr_method: "POST",
                            xhr_timeout: (1000 * 5),
                            xhr_cache: false,
                            xhr_data_type: "json",
                            xhr_cross_domain: true,
                            xhr_with_credentials: true,
                            skip_pr: false,
                            fn_alert: _this._o.checkout.fn_notify,
                            callbefore_send: function (jqXHR, settings) {
                                Loading = true;
                                ob.callbefore_send(jqXHR, settings);
                                _this._o.checkout.fn_ShowLoading(true);
                            },
                            callback_on_success: function (data, textStatus, jqXHR) {
                                _this.init_checkout();
                                ob.callback_on_success(data, textStatus, jqXHR);
                            },
                            callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                ob.callback_on_error(jqXHR, textStatus, errorThrown);
                            },
                            callback_on_complete: function (jqXHR, textStatus) {
                                ob.callback_on_complete(jqXHR, textStatus);
                                Loading = false;
                                _this._o.checkout.fn_ShowLoading(false);
                            }
                        }, ob.xhr_action);
                    });
                }
            };
            this.BindShowOffer = function(){

            };
            this.BindApplyOffer = function(){
                var s_cc = jQuery(_this._o.checkout.offer.s_coupon_code);
                var s_of = jQuery(_this._o.checkout.offer.s_offer);
                var ob = _this._o.checkout.btn.apply_offer;

                _this.old_my_cc = s_cc.val();
                _this.old_my_of = jQuery(_this._o.checkout.offer.s_offer+':checked').val();

                if(_this.old_my_cc != ''){s_of.prop('disabled',true);}

                if(s_cc.length > 0){
                    s_cc.off('keyup');
                    s_cc.on('keyup',function(){
                        var cc = jQuery(this).val();
                        if(cc!=''){s_of.prop('checked',false).prop('disabled',true);}
                        else{s_of.prop('checked',false).prop('disabled',false);}
                    });
                }

                if(jQuery(ob.s).length > 0){
                    jQuery(ob.s).off('click');
                    jQuery(ob.s).on('click',function(){
                        var onC={};
                        onC.t = jQuery(this);
                        onC.my_cc = s_cc.val();
                        onC.my_offer = jQuery(_this._o.checkout.offer.s_offer+':checked').val();

                        if(onC.my_cc == '' && onC.my_offer == ''){return false;}
                        if(_this.old_my_cc == onC.my_cc && _this.old_my_of == onC.my_offer){return false;}

                        jQuery(_this._o.checkout.offer.s_btn_close).trigger('click');

                        onC.send_data = [{name: 'my_cc', value: onC.my_cc}, {name: 'my_offer', value: onC.my_offer}];
                        onC.send_data = _this.set_in_checkout(onC.send_data);
                        jQuery.jAjaxCall({
                            send_data: onC.send_data,
                            xhr_area: ob.xhr_area,
                            xhr_module: ob.xhr_module,
                            xhr_action: ob.xhr_action,
                            xhr_url: ob.xhr_url,
                            xhr_method: "POST",
                            xhr_timeout: (1000 * 5),
                            xhr_cache: false,
                            xhr_data_type: "json",
                            xhr_cross_domain: true,
                            xhr_with_credentials: true,
                            skip_pr: false,
                            fn_alert: _this._o.checkout.fn_notify,
                            callbefore_send: function (jqXHR, settings) {
                                Loading = true;
                                ob.callbefore_send(jqXHR, settings);
                                _this._o.checkout.fn_ShowLoading(true);
                            },
                            callback_on_success: function (data, textStatus, jqXHR) {
                                _this.init_checkout();
                                ob.callback_on_success(data, textStatus, jqXHR);
                            },
                            callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                ob.callback_on_error(jqXHR, textStatus, errorThrown);

                                s_cc.val(_this.old_my_cc);
                                s_of.prop('checked',false);
                                jQuery(_this._o.checkout.offer.s_offer+'[value="'+_this.old_my_of+'"]').prop('checked',true);
                                if(_this.old_my_cc != ''){s_of.prop('disabled',true);}
                            },
                            callback_on_complete: function (jqXHR, textStatus) {
                                ob.callback_on_complete(jqXHR, textStatus);
                                Loading = false;
                                _this._o.checkout.fn_ShowLoading(false);
                            }
                        }, ob.xhr_action);
                    });
                }
            };
            this.BindRemoveOffer = function(){
                var ob = _this._o.checkout.btn.remove_offer;
                if(jQuery(ob.s).length > 0){
                    jQuery(ob.s).off('click');
                    jQuery(ob.s).on('click',function(){
                        var send_data = [];
                        send_data = _this.set_in_checkout(send_data);
                        jQuery.jAjaxCall({
                            send_data: send_data,
                            xhr_area: ob.xhr_area,
                            xhr_module: ob.xhr_module,
                            xhr_action: ob.xhr_action,
                            xhr_url: ob.xhr_url,
                            xhr_method: "POST",
                            xhr_timeout: (1000 * 5),
                            xhr_cache: false,
                            xhr_data_type: "json",
                            xhr_cross_domain: true,
                            xhr_with_credentials: true,
                            skip_pr: false,
                            fn_alert: _this._o.checkout.fn_notify,
                            callbefore_send: function (jqXHR, settings) {
                                Loading = true;
                                ob.callbefore_send(jqXHR, settings);
                                _this._o.checkout.fn_ShowLoading(true);
                            },
                            callback_on_success: function (data, textStatus, jqXHR) {
                                _this.init_checkout();
                                ob.callback_on_success(data, textStatus, jqXHR);
                            },
                            callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                ob.callback_on_error(jqXHR, textStatus, errorThrown);
                            },
                            callback_on_complete: function (jqXHR, textStatus) {
                                ob.callback_on_complete(jqXHR, textStatus);
                                Loading = false;
                                _this._o.checkout.fn_ShowLoading(false);
                            }
                        }, ob.xhr_action);
                    });
                }
            };
            this.BindNextPrevious = function(){
                var cf = jQuery(_this._o.checkout.s_form);
                var ob = _this._o.checkout.btn.next_previous;

                var cs, np = jQuery('button[type="submit"][name="'+ob.e_name+'"]');
                np.off('click'); np.on('click',function(){cs = jQuery(this).val();});

                if(cf.length == 1){
                    cf.off('validate');
                    cf.validate({
                        ignore: ':hidden:not([class~=selectized]),:hidden > .selectized, .selectize-control .selectize-input input',
                        submitHandler: function(f){
                            var send_data = jQuery(f).serializeArray();
                            var obj_send_data = jQuery.fn.serializeArrayToObject(send_data);

                            if(!obj_send_data[ob.e_name])
                            {
                                send_data.push({name:ob.e_name,value:cs});
                                obj_send_data[ob.e_name] = cs;
                            }

                            if(!obj_send_data[ob.e_name] || (obj_send_data[ob.e_name]!=ob.val_next && obj_send_data[ob.e_name]!=ob.val_previous)){_this._o.checkout.fn_notify('error',_this._o.msg.e.ambiguous);return false;}

                            send_data.push({name:'step',value:_this.cur_step});
                            send_data = _this.set_in_checkout(send_data);
                            jQuery.jAjaxCall({
                                send_data: send_data,
                                xhr_area: ob.xhr_area,
                                xhr_module: ob.xhr_module,
                                xhr_action: ob.xhr_action,
                                xhr_url: ob.xhr_url,
                                xhr_method: "POST",
                                xhr_timeout: (1000 * 5),
                                xhr_cache: false,
                                xhr_data_type: "json",
                                xhr_cross_domain: true,
                                xhr_with_credentials: true,
                                skip_pr: false,
                                fn_alert: _this._o.checkout.fn_notify,
                                callbefore_send: function (jqXHR, settings) {
                                    Loading = true;
                                    ob.callbefore_send(jqXHR, settings);
                                    _this._o.checkout.fn_ShowLoading(true);
                                },
                                callback_on_success: function (data, textStatus, jqXHR) {
                                    _this.init_checkout();
                                    _this.RedirectTo();
                                    if(data.DATA && data.DATA.goto){_this.GoTo(data.DATA.goto);}
                                    ob.callback_on_success(data, textStatus, jqXHR);
                                    scrollTo(0,0);
                                },
                                callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                    ob.callback_on_error(jqXHR, textStatus, errorThrown);
                                },
                                callback_on_complete: function (jqXHR, textStatus) {
                                    var cs = jQuery(_this._o.checkout.s_cur_step).attr(_this._o.checkout.av_cur_step);
                                    if(cs != _this.cur_step){if(obj_send_data[ob.e_name] == ob.val_next){_this.cur_step++;}else{_this.cur_step--;}}

                                    ob.callback_on_complete(jqXHR, textStatus);
                                    Loading = false;
                                    _this._o.checkout.fn_ShowLoading(false);
                                }
                            }, ob.xhr_action);
                            return false;
                        }
                    });
                }
            };
            this.BindAddressBook = function(){
                var ak=[]; ak=['sa','ba'];
                jQuery.each(ak,function(k,a){
                    var ob; ob = _this._o.checkout.address[a];
                    jQuery.extend(ob,_this._o.checkout.address.sba_book);
                    if(jQuery(ob.s_book).length == 1){
                        jQuery(ob.s_book).off('change');
                        jQuery(ob.s_book).on('change',function(){
                            var onC={};
                            onC.t = jQuery(this);
                            onC.a_id = onC.t.val();
                            if(onC.a_id && onC.a_id != ''){
                                jQuery(_this._o.checkout.address.s_same_as).prop('checked',false);
                                onC.send_data = [{name:'a',value:onC.a_id}];
                                onC.send_data = _this.set_in_checkout(onC.send_data);
                                jQuery.jAjaxCall({
                                    send_data: onC.send_data,
                                    xhr_area: ob.xhr_area,
                                    xhr_module: ob.xhr_module,
                                    xhr_action: ob.xhr_action,
                                    xhr_url: ob.xhr_url,
                                    xhr_method: "POST",
                                    xhr_timeout: (1000 * 5),
                                    xhr_cache: false,
                                    xhr_data_type: "json",
                                    xhr_cross_domain: true,
                                    xhr_with_credentials: true,
                                    skip_pr: false,
                                    fn_alert: _this._o.checkout.fn_notify,
                                    callbefore_send: function (jqXHR, settings) {
                                        Loading = true;
                                        ob.callbefore_send(ob, jqXHR, settings);
                                        _this._o.checkout.fn_ShowLoading(true);
                                    },
                                    callback_on_success: function (data, textStatus, jqXHR) {
                                        if(data && data.DATA){_this.SetAddressFromAddressBook(ob,data.DATA);}
                                        ob.callback_on_success(ob, data, textStatus, jqXHR);
                                    },
                                    callback_on_error: function (jqXHR, textStatus, errorThrown) {
                                        ob.callback_on_error(ob, jqXHR, textStatus, errorThrown);
                                    },
                                    callback_on_complete: function (jqXHR, textStatus) {
                                        ob.callback_on_complete(ob, jqXHR, textStatus);
                                        Loading = false;
                                        _this._o.checkout.fn_ShowLoading(false);
                                    }
                                }, ob.xhr_action);
                            }
                        });
                    }
                });
            },
            this.BindGeoLocationForAddress = function(){
                var ak=[]; ak=['sa','ba'];
                jQuery.each(ak,function(k,a){
                    var ob; ob = _this._o.checkout.address[a];
                    if(jQuery('['+ob.a_e_index+']').length > 1){
                        jQuery(ob.s_div).jOnDependent({
                            a_e_index   :   ob.a_e_index,

                            valueField  :   'id',
                            labelField  :   'title',
                            searchField :   'title',
                            sortField   :   'title',

                            xhr_area    :   _this._o.checkout.address.geo_location.xhr_area,
                            xhr_module  :   _this._o.checkout.address.geo_location.xhr_module,
                            xhr_action  :   _this._o.checkout.address.geo_location.xhr_action,
                            xhr_url     :   _this._o.checkout.address.geo_location.xhr_url,
                            fn_alert    :   _this._o.listing.fn_notify,
                            callbefore_send     :   _this._o.checkout.address.geo_location.callbefore_send,
                            callback_on_success :   _this._o.checkout.address.geo_location.callback_on_success,
                            callback_on_error   :   _this._o.checkout.address.geo_location.callback_on_error,
                            callback_on_complete:   _this._o.checkout.address.geo_location.callback_on_complete,
                        });
                    }
                });
            };
            this.SetAddressFromAddressBook = function(ob,d){
                if(typeof d=='object' && typeof ob=='object'){
                    var form=jQuery(ob.s_div);
                    jQuery.each(_this._o.checkout.address.name_sb_fields,function(k,f){
                        var fname = ob.prefix_f+f;
                        var cnt = form.find("[name='"+fname+"']")[0].nodeName.toLowerCase();
                        if(f=='country' || f=='state' || f=='city')
                        {
                            if(f=='country')
                            {
                                var vid = d.country_id;
                                var vname =  d.country_name;
                            }
                            else if(f=='state')
                            {
                                var vid = d.state_id;
                                var vname =  d.state_name;
                            }
                            else if(f=='city')
                            {
                                var vid = d.city_id;
                                var vname =  d.city_name;
                            }
                            var e = form.find("[name='"+fname+"']")[0].selectize;
                            e.addOption({"id":vid,"title":vname});
                            e.setValue(vid);
                        }
                        else if(cnt == 'select')
                        {
                            form.find("[name='"+fname+"'] option:selected").prop("selected", false).removeAttr("selected");

                            if(form.find("[name='"+fname+"'][multiple]").length == 1){}
                            else{form.find("[name='"+fname+"'] option[value='"+d[f]+"']").attr("selected",true).prop("selected", true);}
                        }
                        else{form.find("[name='"+fname+"']").val(d[f]);}
                    });
                }
            };
            this.BindAddressSameAs = function(){
                var s = jQuery(_this._o.checkout.address.s_same_as);
                if(s.length == 1){
                    var onC={};
                    onC.f_t = _this._o.checkout.address.same_as_from_to;
                    onC.from = _this._o.checkout.address[onC.f_t[0]];
                    onC.to = _this._o.checkout.address[onC.f_t[1]];
                    s.off('change');
                    s.on('change',function(){
                        onC.st = jQuery(this).prop('checked');
                        if(onC.st===true && jQuery(onC.from.s_div).length == 1 && jQuery(onC.to.s_div).length == 1){
                            jQuery(':input[name]', onC.from.s_div).each(function(i){
                                onC.t=jQuery(this);
                                if(onC.t.is("input[type='text']") == true || onC.t.is("textarea") == true)
                                {
                                    jQuery(jQuery(':input[name]', onC.to.s_div)[i]).val(onC.t.val());
                                }
                                if(onC.t.is("input[type='checkbox']") == true || onC.t.is("input[type='radio']") == true)
                                {
                                    if(onC.t.is(":checked") == true){jQuery(jQuery(':input[name]', onC.to.s_div)[i]).prop('checked',true);}
                                    else{jQuery(jQuery(':input[name]', onC.to.s_div)[i]).prop('checked',false);}
                                }
                                else if(onC.t.is("select") == true)
                                {
                                    if(onC.t.is("select[multiple='multiple']") == true){}
                                    else
                                    {
                                        if(jQuery(jQuery(':input[name]', onC.to.s_div)[i]).find("option[value='"+onC.t.val()+"']").length == 1)
                                        {
                                            jQuery(jQuery(':input[name]', onC.to.s_div)[i]).find("option[selected='selected']").prop('selected',false);
                                            jQuery(jQuery(':input[name]', onC.to.s_div)[i]).find("option[value='"+onC.t.val()+"']").prop('selected',true);
                                        }
                                        else
                                        {
                                            var otext = onC.t.find("option[value='"+onC.t.val()+"']").text();
                                            var ohtml = '<option value="'+onC.t.val()+'" selected="selected">'+otext+'</option>';

                                            jQuery(jQuery(':input[name]', onC.to.s_div)[i]).find("option[selected='selected']").removeAttr('selected');
                                            jQuery(jQuery(':input[name]', onC.to.s_div)[i]).append(ohtml);
                                        }
                                    }
                                }
                            });
                            jQuery('['+onC.from.a_e_index+']', onC.from.s_div).each(function(j){
                                var i = jQuery(this).attr(onC.from.a_e_index);
                                var e = jQuery('['+onC.to.a_e_index+'="'+i+'"]', onC.to.s_div)[0].selectize;
                                var vid = jQuery(this)[0].selectize.getValue();
                                var vname = jQuery(this)[0].selectize.getItem(vid).text();
                                var vdata = {"id":vid,"title":vname};
                                e.addOption(vdata);e.setValue(vid);
                            });
                        }
                    });
                }
            };
            this.RedirectTo = function(){
                setTimeout(function(){
                    var s = jQuery(_this._o.checkout.s_redirect);
                    if(s.length == 1){
                        var url = s.attr('href');
                        window.location = url;
                    }
                },1500);
            };
            this.GoTo = function(gt){
                setTimeout(function(){
                    var es = '[name="' +_this._o.checkout.btn.next_previous.e_name+'"]';
                    es += '[value="'+gt+'"]:first';
                    jQuery(es).trigger('click');
                },1500);
            };
            this.BindChangeBilling = function(){

            };
            this.BindChangeShipping = function(){

            };
            return this.init();
        };
        jQuery.jOnlinePurchase._oDefault = {
            is_user_logged      :   false,
            in_checkout         :   false,
            fn_on_init          :   function (e) {},
            msg: {
                s: {},
                e: {
                    select_rd:  "Please select required detail.",
                    ambiguous: "Sorry, unable to send your request. Please try again or reload your web page.",
                    invalid_qty: "Please enter valid quantity.",
                    max_qty_only: "Your quantity exceeds maximum purchase limit. Maximum quantity limit is",
                    min_qty_required: "Please enter minimum required quantity. Minimum quantity limit is",
                },
                i: {},
                w: {},
                c: {
                    empty_cart: "Are you sure you want to empty your shopping bag?",
                    cancel_order: "Are you sure you want to cancel your order?"
                }
            },
            listing:{
                s_ref_id        :   '[data-ref-id]',
                va_ref_id       :   'data-ref-id',
                s_ref_type      :   '[data-ref-type]',
                va_ref_type     :   'data-ref-type',
                s_ref_required_div  :   '[data-ref-required="true"]',
                s_ref_additional    :   '[data-ref-additional]',
                va_ref_additional   :   'data-ref-additional',
                btn: {
                    quick_view:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    buy_now:{
                        s: '',
                        check_rr    :   true,
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    add_to_cart:{
                        s: '',
                        check_rr    :   true,
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    add_to_wish_list:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    add_to_compare:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    show_rating:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    see_similar:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    send_enquiry:{
                        s: '',
                        s_se_div    :   '',

                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                },
                fn_ShowLoading  :   function(s,l_in){},
                fn_notify       :   function(mt,m){}
            },
            checkout:{
                initial_step        :   1,
                total_step          :   5,
                s_cur_step          :   '',
                av_cur_step         :   '',
                s_form              :   '',
                s_redirect          :   '',
                btn:{
                    change_item_qty:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    remove_item:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    empty_cart:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(jqXHR, settings){},
                        callback_on_success: function(data, textStatus, jqXHR){},
                        callback_on_error : function(jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(jqXHR, textStatus){}
                    },
                    cancel_order:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(jqXHR, settings){},
                        callback_on_success: function(data, textStatus, jqXHR){},
                        callback_on_error : function(jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(jqXHR, textStatus){}
                    },
                    next_previous:{
                        e_name: '',
                        val_next: 'N',
                        val_previous: 'P',

                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    apply_offer:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                    remove_offer:{
                        s: '',
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    }
                },
                pi:{
                    s_purchase_id   :   '',
                    va_purchase_id  :   '',
                    s_purchase_type :   '',
                    va_purchase_type:   '',

                    s_qty           :   '',
                    s_max_oq        :   '',
                    s_min_oq        :   '',
                },
                offer:{
                    s_container     :   '',
                    s_coupon_code   :   '',
                    s_offer         :   '',
                    s_btn_show      :   '',
                    s_btn_close     :   '',
                },
                address:{
                    s_send_as_gift  :   '',
                    s_same_as       :   '',
                    same_as_from_to :   ['sa','ba'],
                    name_sb_fields  :   [],
                    sa              :   {
                        s_div       :   '',
                        s_book      :   '',
                        s_alter     :   '',
                        s_ond       :   '',
                        prefix_f    :   '',

                        a_e_index   :   '',
                    },
                    ba              :   {
                        s_div       :   '',
                        s_book      :   '',
                        s_alter     :   '',
                        prefix_f    :   '',

                        a_e_index   :   '',
                    },
                    sba_book        :   {
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(ob, jqXHR, settings){},
                        callback_on_success: function(ob, data, textStatus, jqXHR){},
                        callback_on_error : function(ob, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(ob, jqXHR, textStatus){}
                    },
                    geo_location    :   {
                        xhr_area    :   '',
                        xhr_module  :   '',
                        xhr_action  :   '',
                        xhr_url     :   '',
                        callbefore_send: function(onC, jqXHR, settings){},
                        callback_on_success: function(onC, data, textStatus, jqXHR){},
                        callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                        callback_on_complete: function(onC, jqXHR, textStatus){}
                    },
                },
                fn_ShowLoading  :   function(s,l_in){},
                fn_notify       :   function(mt,m){}
            }
        };
        jQuery.fn.jOnlinePurchase = function (options) {
            return jQuery.each(this, function (i, element) {
                var $element;
                $element = jQuery(element);
                if ($element.length > 0) {
                    if (!$element.data(pBI) || $element.data(pBI) == null || $element.data(pBI) == '') {
                        $element.data(pBI, new jQuery.jOnlinePurchase(element, options));
                    }
                }
            });
        };
        return void 0;
    })(jQuery);
}).call(this);