var Url_GAR = XHR_Url+'/ajax',Url_GUS = XHR_Url+'/suggestion',FormDataHistory = [],tts = '[data-tooltip="true"]';
function _ka(){setInterval(function(){jQuery.ajax({url:'/keep-alive/',type:'POST',dataType:'json',data:{},crossDomain:true,xhrFields:{withCredentials:true}});},1300000);}
function rl(){var s = 'data-reload';jQuery('#mba-2').on('click','['+s+']',function(){
        var t = jQuery(this).attr(s),fg = false;if(t=='cc'){fg = true;}location.reload(fg);
        /*jQuery.ajax({
            url: "",
            context: document.body,
            success: function(s,x){
                jQuery('html[manifest="saveappoffline.appcache"]').attr('content','');jQuery(this).html(s);
            }
        });*/
    });
}
function lzl(){jQuery('img.lzl').show().lazyload({data_attribute:'lzl',failure_limit:20,threshold:500,effect:"fadeIn",skip_invisible:true}).removeClass("lzl");}
function tt(){if(cw() == CW_S_LG || cw() == CW_S_XL){if(jQuery(tts).length > 0 && jQuery().tooltip){jQuery('body').tooltip({selector: tts});}}}
/**
 * @aNotify show popup nofify on screen
 * @m = message to display
 * @mt = success, danger, warning, info
 **/
function aNotify(m,mt){
    if(!m || !mt) return false;
    if(mt == 'error'){mt='danger';} var nac='#wpac', malert='<div class="alert alert-dismissible alert-'+mt+' fade in" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong  class="fa"></strong>'+m+'</div>';
    jQuery(nac).prepend(malert);
    jQuery(nac+" .alert:nth-child(5)").nextAll('.alert').remove();
}
/**
 * @bNotify show popup nofify on screen
 * @m = message to display
 * @mt = alert, success, error, warning, information, confirm
 * @l = top, topLeft, topRight, topCenter, bottom, bottomLeft, bottomRight, bottomCenter, center, centerLeft, centerRight
 * @modal = true | false
 * @b = objetc of array
 * @t = html code to use as template for notyfy
 **/
function bNotify(m,mt,l,modal,b,t){
    if(!m || !mt){return false;}
    if(!l){if(cw() == CW_S_LG || cw() == CW_S_XL){l='topRight'}else{l='top'}}
    notyfy({
        text: m,
        type: mt,
        layout: l,
        modal: modal,
        buttons: b,
        template: t,
        showEffect:  function(bar) { bar.animate({ height: 'toggle' }, 300, 'swing'); },
        hideEffect:  function(bar) { bar.slideUp();},
        timeout: 15000,
        force: true
        /*dismissQueue: true*/
    });
}
function loading(s,l_in,s_name,icon){
    if(s == true){
        if(!l_in){l_in = '.loading-area';}if(!s_name){s_name = 'Loading';}if(!icon){icon = '<i class="fa fa-spinner fa-pulse fa-2x text-primary"></i><br />';}
        jQuery(l_in).append('<div class="processing"><p>'+icon+s_name+'<span>.</span><span>.</span><span>.</span></p></div>');
    }
    else{jQuery('.processing').remove();}
}
/*
function ResizeNiceScroll(){
    jQuery(".wns").scroll(function(){
        jQuery(".wns").getNiceScroll().resize();
    });
}
function BindNiceScroll(){
    if(jQuery('.wns').length > 0){
        setTimeout(function(){
            jQuery('.wns').niceScroll({
                scrollspeed: 10,
                mousescrollstep: 100,
                cursorborder: "0",
                cursorborderradius: "0",
                cursorcolor: "#5f5f5f",
                bouncescroll: true,
                cursorwidth: "6px",
                autohidemode: "leave",
                hwacceleration: true,
                grabcursorenabled: false,
                touchbehavior: false,
                cursordragontouch: true,
                //background: "red",
                //railoffset: { top: 0, right: 3, left: 3, bottom: 0 },
                //railpadding: { top: 0, right: 3, left: 3, bottom: 0 },
            });
        }, 500);

        ResizeNiceScroll();
    }
}
function UnBindNiceScroll(){if(jQuery('.wns').length > 0){jQuery(document).unbind("niceScroll");}}
*/
function BindNavTree(){
    if(jQuery('.nav-tree').length > 0) {
        jQuery('.nav-tree p').off('click');
        jQuery('.nav-tree p').on('click', function () {
            var ele = jQuery(this);
            jQuery(this).next('ul').toggle(400, function () {
                if (jQuery(this).is(':visible')) {ele.addClass('open');}else {ele.removeClass('open');}
            });
        });
    }
}
function BCOCSlider(s,r){
    if(jQuery(s).length > 0 && jQuery().owlCarousel) {
        jQuery(s).owlCarousel({
            /*loop:true,
            autoplay:true,
            autoplayTimeout:5000,
            autoplayHoverPause:true,*/
            smartSpeed: 105,
            fluidSpeed: 1000,
            dragEndSpeed: 1,
            slideBy: 2,
            dots: false,
            nav: true,
            navText: [
                "<i class='fa fa-chevron-left fa-2x'></i>",
                "<i class='fa fa-chevron-right fa-2x'></i>"
            ],
            responsive: r
        }).on('changed.owl.carousel', function (event) {
            setTimeout(function () {
                jQuery(window).trigger('scroll');
            }, 450);
        });
    }
}
function BOP(){
    if(jQuery('body').length != 1 || !jQuery().jOnlinePurchase){return false;}
    jQuery('body').jOnlinePurchase({
        is_user_logged      :   IsUserLogged,
        in_checkout         :   InCheckout,
        fn_on_init          :   function (e) {},

        listing: {
            s_ref_id        :   '[data-ref-id]',
            va_ref_id       :   'data-ref-id',
            s_ref_type      :   '[data-ref-type]',
            va_ref_type     :   'data-ref-type',
            s_ref_required_div  :   '[data-ref-required="true"]',
            s_ref_additional    :   '[data-ref-additional]',
            va_ref_additional   :   'data-ref-additional',
            btn: {
                quick_view: {
                    s: '[data-quick-view="true"]',
                    xhr_area: 'LR_Action',
                    xhr_module: 'View',
                    xhr_action: 'QuickView',
                    xhr_url: Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){jQuery(tts).tooltip('hide');},
                    callback_on_success: function(onC, data, textStatus, jqXHR){
                        jQuery("#lr-etc-modal").modal();BindImageGallery();
                        jQuery('[rel="vid"]').on('click',function(){jQuery('#lr-etc-modal .modal-content').scrollTop(jQuery('#vid').offset().top-90);});
                    },
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                buy_now: {
                    s: '[data-buy-now="true"]',
                    check_rr    :   true,
                    xhr_area    :   'LR_OP',
                    xhr_module  :   'Cart',
                    xhr_action  :   'BuyNow',
                    xhr_url     :   Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                add_to_cart: {
                    s: '[data-add-to-cart="true"]',
                    check_rr    :   true,
                    xhr_area    :   'LR_OP',
                    xhr_module  :   'Cart',
                    xhr_action  :   'AddToCart',
                    xhr_url     :   Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){
                        jQuery('.r-icon-menu').fadeOut(400).fadeIn(400).fadeOut(400).fadeIn(400);
                    },
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                add_to_wish_list: {
                    s: '[data-add-to-wish-list="true"]',
                    xhr_area: 'LR_Action',
                    xhr_module: 'WishList',
                    xhr_action: 'Add',
                    xhr_url: Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                add_to_compare: {
                    s: '[data-add-to-compare="true"]',
                    xhr_area: 'LR_Action',
                    xhr_module: 'Compare',
                    xhr_action: 'Add',
                    xhr_url: Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                show_rating:{
                    s: '[data-show-rating]',
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
                    s: '[data-see-similar]',
                    xhr_area    :   '',
                    xhr_module  :   '',
                    xhr_action  :   '',
                    xhr_url     :   '',
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                send_enquiry: {
                    s: '[data-send-enquiry]',
                    s_se_div    :   '#site-contact-us',
                    xhr_area    :   'GRequest',
                    xhr_module  :   'Form',
                    xhr_action  :   'CUSReq',
                    xhr_url     :   Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
            },
            fn_ShowLoading  :   function(s,l_in){
                if(s == true){jQuery(l_in).addClass('processing-bottom');loading(true,l_in,'<small>Processing</small>',' ');}
                else{jQuery(l_in).removeClass('processing-bottom');loading(false,l_in);}
            },
            fn_notify       :   function(mt,m){
                bNotify(m,mt);
            }
        },
        checkout: {
            initial_step        :   jQuery('#cur_step').val(),
            total_step          :   6,
            s_cur_step          :   '#cur_step',
            av_cur_step         :   'value',
            s_form              :   '#checkout',
            s_redirect          :   '[data-redirect="true"]',
            btn: {
                change_item_qty: {
                    s: '[data-pi-qty-change="true"]',
                    xhr_area: 'LR_OP',
                    xhr_module: 'Cart',
                    xhr_action: 'ChangeItemQty',
                    xhr_url: Url_GAR,
                    callbefore_send: function(jqXHR, settings){},
                    callback_on_success: function(data, textStatus, jqXHR){},
                    callback_on_error : function(jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(jqXHR, textStatus){}
                },
                remove_item: {
                    s: '[data-pi-remove="true"]',
                    xhr_area: 'LR_OP',
                    xhr_module: 'Cart',
                    xhr_action: 'RemoveItem',
                    xhr_url: Url_GAR,
                    callbefore_send: function(jqXHR, settings){},
                    callback_on_success: function(data, textStatus, jqXHR){},
                    callback_on_error : function(jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(jqXHR, textStatus){}
                },
                empty_cart: {
                    s: '[data-empty-cart="true"]',
                    xhr_area: 'LR_OP',
                    xhr_module: 'Checkout',
                    xhr_action: 'EmptyCart',
                    xhr_url: Url_GAR,
                    callbefore_send: function(jqXHR, settings){},
                    callback_on_success: function(data, textStatus, jqXHR){},
                    callback_on_error : function(jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(jqXHR, textStatus){}
                },
                cancel_order: {
                    s: '[data-cancel-order="true"]',
                    xhr_area: 'LR_OP',
                    xhr_module: 'Checkout',
                    xhr_action: 'CancelOrder',
                    xhr_url: Url_GAR,
                    callbefore_send: function(jqXHR, settings){},
                    callback_on_success: function(data, textStatus, jqXHR){},
                    callback_on_error : function(jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(jqXHR, textStatus){}
                },
                next_previous: {
                    e_name: 'np_type',
                    val_next: 'N',
                    val_previous: 'P',

                    xhr_area: 'LR_OP',
                    xhr_module: 'Checkout',
                    xhr_action: 'NextPrevious',
                    xhr_url: Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){
                        if(IsUserLogged === false){Bauth();}
                    },
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                apply_offer: {
                    s: '[data-apply-offer="true"]',
                    xhr_area: 'LR_OP',
                    xhr_module: 'Checkout',
                    xhr_action: 'ApplyOffer',
                    xhr_url: Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
                remove_offer: {
                    s: '[data-remove-offer="true"]',
                    xhr_area: 'LR_OP',
                    xhr_module: 'Checkout',
                    xhr_action: 'RemoveOffer',
                    xhr_url: Url_GAR,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                }
            },
            pi: {
                s_purchase_id   :   '[data-pi-ref-id]',
                va_purchase_id  :   'data-pi-ref-id',
                s_purchase_type :   '[data-pi-ref-type]',
                va_purchase_type:   'data-pi-ref-type',

                s_title     :   '[data-pi-title="true"]',
                s_qty       :   '[data-pi-qty="true"]',
                s_max_oq    :   '[data-pi-max-oq="true"]',
                s_min_oq    :   '[data-pi-min-oq="true"]',
            },
            offer:{
                s_container     :   '#offer-list',
                s_coupon_code   :   '[data-cc="true"]',
                s_offer         :   '[data-offer="true"]',
                s_btn_show      :   '[data-target="#pc-offer-list"]',
                s_btn_close     :   '[data-close-offer="true"]',
            },
            address:{
                s_send_as_gift  :   '#send-as-gift',
                s_same_as       :   '#same-as-shipping-address',
                name_sb_fields  :   ['firstname','lastname','address','mobile_ccode','mobile','zipcode','region','country','state','city'],
                same_as_from_to :   ['sa','ba'],
                sa              :   {
                    s_div       :   '#pc-shipping',
                    s_book      :   '#cust_ship_address_book',
                    s_alter     :   '#alter-shipping',
                    prefix_f    :   'cust_ship_',

                    a_e_index   :   'data-sgl',
                },
                ba              :   {
                    s_div       :   '#pc-billing',
                    s_book      :   '#cust_bill_address_book',
                    s_alter     :   '#alter-billing',
                    prefix_f    :   'cust_bill_',

                    a_e_index   :   'data-bgl',
                },
                sba_book        :   {
                    xhr_area    :   'UAReq',
                    xhr_module  :   'ABook',
                    xhr_action  :   'Get',
                    xhr_url     :   Url_GAR,
                    callbefore_send: function(ob, jqXHR, settings){},
                    callback_on_success: function(ob, data, textStatus, jqXHR){},
                    callback_on_error : function(ob, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(ob, jqXHR, textStatus){}
                },
                geo_location    :   {
                    xhr_area    :   'GeoLocation',
                    xhr_module  :   'Suggestion',
                    xhr_action  :   'Get',
                    xhr_url     :   Url_GUS,
                    callbefore_send: function(onC, jqXHR, settings){},
                    callback_on_success: function(onC, data, textStatus, jqXHR){},
                    callback_on_error : function(onC, jqXHR, textStatus, errorThrown){},
                    callback_on_complete: function(onC, jqXHR, textStatus){}
                },
            },
            fn_ShowLoading  :   function(s,l_in){
                if(InCheckout && InCheckout===true){loading(s,'#checkout .processing-over:first');}
            },
            fn_notify       :   function(mt,m){
                if(InCheckout && InCheckout===true){aNotify(m,mt);jQuery(window).scrollTop(0);}
                else{bNotify(m,mt);}
            }
        }
    });
}
function SFCall(f){
    var fid = f.attr('id');
    var fdata = jQuery("#"+fid).serializeArray();
    var cdata = jQuery('#'+fid).serialize();

    if(cdata == FormDataHistory[fid]){return true;}
    else{FormDataHistory[fid] = cdata;}

    if(fid == 'contact-us-form')
    {
        jQuery.jAjaxCall({
            send_data   :   fdata,
            xhr_area    :   'GRequest',
            xhr_module  :   'Form',
            xhr_action  :   'CUSReq',
            xhr_url     :   Url_GAR,
            fn_alert    :   function (mt, m) {aNotify(m,mt);},
            callbefore_send: function (jqXHR, settings) {loading(true,'#'+fid+' .processing-over');},
            callback_on_success: function (data, textStatus, jqXHR) {
                jQuery('#'+fid).trigger('reset');
                jQuery('#site-contact-us').find('[data-dismiss="modal"]').trigger('click');
            },
            callback_on_error: function (jqXHR, textStatus, errorThrown) {},
            callback_on_complete: function (jqXHR, textStatus) {loading(false);}
        }, 'contactusreq');
    }
}
function XHRfs(s,call){
    if(jQuery(s).length > 0 && jQuery().validate){
        jQuery(s).each(function(){
            var objForm      =  jQuery(this);
            var objValidator =  objForm.validate({ignore:':hidden:not([class~=selectized], select.bst-select:hidden),:hidden > .selectized, .selectize-control .selectize-input'});
            objForm.data("validator").settings.submitHandler  = function(form) {
                if(call && typeof call == 'function'){call(jQuery(this.currentForm));}
                return false;
            };
        });
        jQuery('.require-group').each(function() {
             jQuery(this).rules('add', {
             require_from_group: [jQuery(this).data('req-min-field'), ".require-group"]

             });
         });
    }
}

/*Basic Form*/
function BFVal(s){if(jQuery(s).length > 0){jQuery(s).validate({ignore: []});}}
/*** EXECUTION CODE ***/
jQuery(document).ajaxStart(function(){

});
jQuery(document).ajaxSend(function(){
    Loading = true;
});
jQuery(document).ajaxSuccess(function(){

});
jQuery(document).ajaxError(function(){

});
jQuery(document).ajaxComplete(function(){
    Loading = false;
});
jQuery(document).ajaxStop(function(){
    lzl();
});
jQuery(document).ready(function(){
    _ka();rl();lzl();tt();BindNavTree();BOP();XHRfs("form[data-form='xhr']",SFCall);
    /*if(cw() == CW_S_LG || cw() == CW_S_XL){BindNiceScroll();}*/
});