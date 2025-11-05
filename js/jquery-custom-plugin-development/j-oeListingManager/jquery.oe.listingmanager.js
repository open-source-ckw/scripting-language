/**
 @file : jquery.oe.listingmanager.js
 @plugin : jListingManager
 @description : This plugin manage all actions and functionality related with any kind of listing
 @dependent : serializeArrayToObject | jAjaxCall | jLoadData | sieve (Required only if need to search inside filter list)
 **/
;(function() {
    (function($) {
        var pBI = "jLMPBI";
        jQuery.jListingManager = function(element, options) {
            var _this = this;

            this.element = element;
            this.$element = jQuery(element);
            this.$element.data(pBI, this);

            this.init = function(){
                _this._o = jQuery.extend({}, jQuery.jListingManager.defaultOptions, options);
                _this.bound_element = _this.$element;

                if(!jQuery().serializeArrayToObject || !jQuery().jAjaxCall || !jQuery().jLoadData || jQuery(_this._o.s_m_div).length <= 0)
                {
                    console.log("Plugin : jListingManager => Dependent jQuery plugins not found. Please load below dependent plugins in same order.");
                    console.log("serializeArrayToObject => "+typeof jQuery().serializeArrayToObject);
                    console.log("jAjaxCall => "+typeof jQuery().jAjaxCall);
                    console.log("jLoadData => "+typeof jQuery().jLoadData);
                    console.log("sieve (Required for search in filter list) => "+typeof jQuery().sieve);
                    console.log("Total count of "+_this._o.s_m_div+" => "+jQuery(_this._o.s_m_div).length);
                    _this.bound_element.data(pBI,null);
                    return false;
                }

                _this.history = '';
                _this.jLDBI = 'jLDBI';
                _this.ajax_uid = _this._o.lm_uid+'ajax';

                _this.LoadData();
                _this.BindListingViewType();
                _this.BindSortOrderDirection();
                _this.BindFilterAction();
                _this.BindFilterListSearch();
                _this.ShowSelectedFilterList();

                _this._o.fn_on_init(this);
                return _this;
            };
            this.inactive = function(){
                jQuery(_this._o.s_m_div).data(_this.jLDBI).InactivePlugin();
                _this.bound_element.data(pBI,null);
            };
            this.LoadData = function(){
                jQuery(_this._o.s_m_div).jLoadData({
                    initial_page        :   _this._o.initial_page,
                    e_pagination        :   _this._o.e_pagination,
                    e_autoload          :   _this._o.e_autoload,
                    al_pl_upto          :   _this._o.al_pl_upto,
                    load_on_scroll      :   _this._o.load_on_scroll,
                    scroll_direction    :   _this._o.scroll_direction,
                    on_window_scroll    :   _this._o.on_window_scroll,
                    continue_autoload   :   _this._o.continue_autoload,
                    s_result_div        :   _this._o.s_lr_div,
                    s_lbm_div           :   _this._o.s_lr_lbm_div,
                    s_load_button       :   _this._o.s_load_more,
                    s_sf_form           :   _this._o.s_lr_fform,
                    s_sc_form           :   _this._o.s_lr_cform,
                    s_pagination_div    :   _this._o.s_lr_pagination_div,
                    s_page_num          :   _this._o.s_pagination,
                    va_page_num         :   _this._o.va_pagination,
                    fn_load_result      :   function(send_data){
                        if(jQuery(_this._o.s_site_search).length == 1){var q = jQuery(_this._o.s_site_search).val(); if(q && q!=''){send_data.push({name:_this._o.ss_post_key, value:q});}}
                        var sp_temp= jQuery.fn.serializeArrayToObject(send_data);
                        /*console.log(send_data);console.log(sp_temp);*/
                        jQuery.jAjaxCall({
                            send_data       :   send_data,
                            xhr_area        :   _this._o.xhr_area,
                            xhr_module      :   _this._o.xhr_module,
                            xhr_action      :   _this._o.xhr_action,
                            xhr_url         :   _this._o.xhr_url,
                            xhr_method      :   "POST",
                            xhr_timeout     :   (1000*5),
                            xhr_cache       :   false,
                            xhr_data_type   :   "json",
                            xhr_cross_domain:   true,
                            xhr_with_credentials: true,
                            skip_pr         :   false,
                            fn_alert        :   _this._o.fn_alert,
                            callbefore_send :   function(jqXHR, settings){
                                jQuery(_this._o.s_m_div).data(_this.jLDBI).loading = true;
                                Loading = true;
                                jQuery(_this._o.s_load_more).hide();

                                if(sp_temp.intention == 'scroll' || sp_temp.intention == 'fr-all'){var l_in = _this._o.s_lr_lbm_div;}else{var l_in = _this._o.s_m_div;}
                                _this._o.fn_ShowLoading(true,l_in);

                                _this._o.callbefore_send(jqXHR, settings);
                            },
                            callback_on_success: function(data, textStatus, jqXHR){
                                if(data.ERROR){jQuery(_this._o.s_m_div).data(_this.jLDBI).cur_page--;}
                                if(data.DATA){
                                    if(_this._o.update_url === true && data.DATA.weburl){window.history.pushState(null, null, data.DATA.weburl);}
                                    if(data.DATA.t_record){
                                        jQuery(_this._o.s_t_record).val(data.DATA.t_record)
                                        jQuery(_this._o.s_tr_div).text(data.DATA.t_record)
                                    }
                                }
                                if(sp_temp.intention == 'lvt')
                                {
                                    jQuery(_this._o.s_m_div).data(_this.jLDBI).cur_page--;
                                }
                                else if(sp_temp.intention == 'fr-all')
                                {
                                    window.location.reload(true);
                                }
                                else
                                {
                                    if(sp_temp.intention == 'fr-group')
                                    {
                                        jQuery("["+_this._o.va_fdiv_group+"='"+jQuery(_this._o.s_fr).val()+"']").find(_this._o.s_fldiv_group).find('input:checked').each(function(e){
                                            jQuery(this).prop('checked',false);
                                        });
                                    }

                                    jQuery(_this._o.s_c_page).val(sp_temp.page);
                                    _this.ReBindPagination();

                                    if(jQuery(_this._o.s_load_more).length == 1){
                                        if(typeof jQuery._data(jQuery(_this._o.s_load_more).get(0),'events') == 'undefined'){
                                            _this.ReBindLoadMoreResultButton();
                                        }
                                    }
                                }

                                if(sp_temp.intention == 'filter' || sp_temp.intention == 'fr-all' || sp_temp.intention == 'fr-group' || sp_temp.intention == 'fr-only')
                                {
                                    _this.ShowSelectedFilterList();
                                }

                                _this._o.callback_on_success(data, textStatus, jqXHR);
                            },
                            callback_on_error: function(jqXHR, textStatus, errorThrown){
                                jQuery(_this._o.s_m_div).data(_this.jLDBI).cur_page--;
                                if(sp_temp.intention == 'filter')
                                {
                                    if(_this.history.is(':checked')){_this.history.prop('checked',false);}
                                    else{_this.history.prop('checked',true);}
                                }
                                _this._o.callback_on_error(jqXHR, textStatus, errorThrown);
                            },
                            callback_on_complete: function(jqXHR, textStatus){
                                jQuery(_this._o.s_fr).val('');
                                jQuery(_this._o.s_m_div).data(_this.jLDBI).loading = false;
                                Loading = false;
                                _this._o.fn_ShowLoading(false);
                                jQuery(_this._o.s_load_more).show();
                                _this._o.callback_on_complete(jqXHR, textStatus);
                            }
                        },_this.ajax_uid);
                    }
                });
            };
            this.LoadPageExternally = function(load_type,page,intention){
                jQuery(_this._o.s_m_div).data(_this.jLDBI).GetSearchResult('',page,intention);
                jQuery(window).scrollTop(0);
            };
            this.ReBindPagination = function(){
                jQuery(_this._o.s_m_div).data(_this.jLDBI).BindPagination();
            };
            this.ReBindLoadMoreResultButton = function(){
                jQuery(_this._o.s_m_div).data(_this.jLDBI).BindLoadMoreResultButton();
            };
            this.BindListingViewType = function(){
                if(jQuery(_this._o.s_lvt).length > 0)
                {
                    jQuery(_this._o.s_lvt).off('change');
                    jQuery(_this._o.s_lvt).on('change',function(){
                        var clvt = jQuery(this).val();
                        jQuery(_this._o.s_lr_div).attr(_this._o.va_lr_lvt,clvt);
                        _this.LoadPageExternally('','','lvt');
                    });
                }
            };
            this.BindSortOrderDirection = function(){
                if(jQuery(_this._o.s_sosd).length > 0)
                {
                    jQuery(_this._o.s_sosd).off('change');
                    jQuery(_this._o.s_sosd).on('change',function(){
                        var csosd = jQuery(this).val().split(":");
                        jQuery(_this._o.s_so).val(csosd[0]);
                        jQuery(_this._o.s_sd).val(csosd[1]);
                        _this.LoadPageExternally('',1,'sosd');
                    });
                }
            };
            this.BindFilterListSearch = function(){

                if(jQuery().sieve &&  jQuery(_this._o.s_fs_group).length > 0)
                {
                    jQuery(_this._o.s_fdiv_group).each(function(e){
                        var sele = jQuery(this).find(_this._o.s_fs_group);
                        if(sele.length == 1)
                        {
                            var sfg = jQuery(this).find(_this._o.s_fldiv_group);
                            jQuery(sfg).unbind('sieve');
                            jQuery(sfg).sieve({
                                searchInput: sele,
                                itemSelector: _this._o.s_fldiv_g_item
                            });
                        }
                    });
                }
            };
            this.BindFilterAction = function(){
                if(jQuery(_this._o.s_fr_all).length > 0)
                {
                    jQuery(_this._o.s_fr_all).off('click');
                    jQuery(_this._o.s_fr_all).on('click',function(){
                        jQuery(_this._o.s_fr).val('all');
                        _this.LoadPageExternally('','','fr-all');
                    });
                }
                if(jQuery(_this._o.s_fr_group).length > 0)
                {
                    jQuery(_this._o.s_fr_group).off('click');
                    jQuery(_this._o.s_fr_group).on('click',function(){
                        var g = jQuery(this).parents(_this._o.s_fdiv_group);
                        var ele = g.find(_this._o.s_fldiv_group).find(':checked, :selected');
                        if(ele.length > 0)
                        {
                            var rfg = g.attr(_this._o.va_fdiv_group);
                            jQuery(_this._o.s_fr).val(rfg);
                            _this.LoadPageExternally('',1,'fr-group');
                        }
                    });
                }
                if(jQuery(_this._o.s_lr_fform).length == 1)
                {
                    jQuery(_this._o.s_lr_fform).find('input, select').off('chnage');
                    jQuery(_this._o.s_lr_fform).find('input, select').on('change',function(){
                        _this.history = jQuery(this);
                        _this.LoadPageExternally('',1,'filter');
                    });
                }
            };
            this.BindRemoveOnlyFilterAction = function(){
                if(jQuery(_this._o.s_fr_g_only).length > 0)
                {
                    jQuery(_this._o.s_fr_g_only).off('click');
                    jQuery(_this._o.s_fr_g_only).on('click',function(){
                        var rfg = jQuery(this).attr(_this._o.va_fr_g_only);
                        var rf = jQuery(this).attr(_this._o.va_fr_only);
                        if(rfg != '')
                        {
                            var fg = jQuery('['+_this._o.va_fdiv_group+'="'+rfg+'"]');
                            if(typeof rf == 'undefined')
                            {
                                fg.find(_this._o.s_fr_group).trigger('click');
                            }
                            else
                            {
                                var fl = fg.find(_this._o.s_fldiv_group).find('[value="'+rf+'"]');
                                fl.prop('checked',false);
                                fl.trigger('change');
                            }
                        }
                    });
                }
            };
            this.ShowSelectedFilterList = function(){
                var b=false;var sfc = jQuery(_this._o.s_lr_ssf_div); sfc.hide();
                sfc.find('ul').html('');

                jQuery(_this._o.s_fr_group).parents(_this._o.s_fdiv_group).each(function(){
                    var sfg_id = jQuery(this).attr(_this._o.va_fdiv_group);
                    var sfg_name = jQuery(this).find(_this._o.s_f_group_name).text();
                    var out='',list='';
                    jQuery(this).find(_this._o.s_fldiv_group).find(':checked, :selected').each(function(){
                        var sf_name = jQuery(this).attr('name');
                        var sf_value = jQuery(this).val();
                        var sf_title = jQuery(this).parent().text();
                        list+='<li><a '+_this._o.va_fr_g_only+'="'+sfg_id+'" '+_this._o.va_fr_only+'="'+sf_value+'" href="javascript:void(0);" title="Remove '+sf_title+'"> '+sf_title+'</a></li>';
                    });

                    if(list != ''){
                        out+='<li><a '+_this._o.va_fr_g_only+'="'+sfg_id+'" href="javascript:void(0);" title="Remove filter for '+sfg_name+'"><mark>'+sfg_name+' &rtrif;</mark></a></li>';
                        out+=list;
                        sfc.find('ul').prepend(out);
                        b=true;
                    }
                });
                if(jQuery(_this._o.s_site_search).length == 1){
                    var q = jQuery(_this._o.s_site_search).val();
                    if(q != ''){
                        sfc.find('ul').prepend('<li><mark style="text-transform: uppercase;" title="Showing result for '+q+'"> '+q+'</mark></li>');
                        b=true;
                    }
                }
                if(b === true){
                    sfc.show();
                    _this.BindRemoveOnlyFilterAction();
                }
            };

            return this.init();
        };
        jQuery.jListingManager.defaultOptions = {
            lm_uid          :   'lmUID',/*any unique id can be alpha numeric*/

            /*Main container related*/
            update_url      :   false,
            s_m_div         :   '#m-container',/*selector : main container in which everything is included*/
            s_lr_div        :   '#lr-container',/*selector : listing result all items container*/
            va_lr_lvt       :   'data-lvt-lr',/*value attribute : current view mode will be found in this attribute. On the basis of this value mode will chnage*/
            s_lr_ssf_div    :   '#lr-sf-selected',/*selector : selected search filter main container which hoslds some addition info like clear all button*/
            s_lr_lbm_div    :   '#lr-btnmsg-container',/*selector : listing result loading icon show area and load more button and last page message container*/
            s_lr_pagination_div :   '#lr-pagination',/*selector : listing result pagination container*/
            s_lr_fform      :   '#lr-filter-form',/*selector : listing result filter form*/
            s_lr_cform      :   '#lr-criteria-form',/*selector : listing result criteria form*/

            s_site_search   :   '#site-search',/*selector : web site search box*/
            ss_post_key     :   'q',/*post key : key to sed data of searched key word*/

            /*Listing result item related*/
            s_lr_item       :   '[data-lr-item]',/*selector : listing result item container*/
            va_lr_iri       :   'data-lri-ref-id',/*value attribute : listing result item id will be found in this attribute*/
            va_lr_irt       :   'data-lri-ref-type',/*value attribute : listing result item type will be found in this attribute*/
            s_lr_wishlist   :   '[data-lr-wishlist]',/*selector : element to add listing result item add in wish list*/
            s_lr_compare    :   '[data-lr-compare]',/*selector : element to add listing result item add in compare list*/
            s_lr_enquiry    :   '[data-lr-enquiry]',/*selector : element to send listing result item enquiry*/
            s_lr_addtocart  :   '[data-lr-addtocart]',/*selector : element to add listing result item to cart*/
            s_lr_rating     :   '[data-lr-rating]',/*selector : element to see listing result item rating*/
            s_lr_ssresult   :   '[data-ss-result="true"]',/*selector : see similar result element*/

            /*Listing search filter related*/
            s_f_show        :   '[data-show-filter]',/*selector : element to show all filter list. In small device filter form will be in popup.*/
            s_fr            :   '[data-remove-filter]',/*selector : element to set clear all filter flag when action performed. This is basically input type is hidden*/
            s_fr_all        :   '[data-fr-all="true"]',/*selector : element to perform remove all filter action*/
            s_fr_only       :   '[data-fr-only]',/*selector : remove only specific single filter element*/
            va_fr_only      :   'data-fr-only',/*value attribute : specific single filter value will be found in this attribute*/
            s_fr_g_only     :   '[data-fr-g-only]',/*selector : remove only specific group filter element*/
            va_fr_g_only    :   'data-fr-g-only',/*value attribute : specific single group filter value will be found in this attribute*/
            s_fdiv_group    :   '[data-fc-group]',/*selector : filter group container*/
            va_fdiv_group   :   'data-fc-group',/*value attribute : filter group name will be found in this attribute*/
            s_f_group_name  :   '[data-fc-name]',/*selector : to get group name*/
            s_fr_group      :   '[data-fr-group]',/*selector : remove filter for specific group element*/
            s_fs_group      :   '[data-fs-group="true"]',/*selector : search box element for filter group value*/
            s_fldiv_group   :   '[data-flc-group]',/*selector : filter list container for each group*/
            s_fldiv_g_item  :   'div',/*selector : filter list item container in each group*/

            /*Listing search criteria related*/
            s_page_size     :   '[data-page-size]'/*selector : element to get maximum number of records should be on listing page. Input or select element*/,
            s_c_page        :   '[data-cpage]'/*selector : element to get current listing page.  Input or select element*/,
            s_lvt           :   '[data-lvt]',/*selector : listing result view mode element. Input or select element*/
            s_sosd          :   '[data-sosd]',/*selector : sort order and sort direction element. Input or select element*/
            s_so            :   '[data-so]',/*selector : sort order element. Input or select element*/
            s_sd            :   '[data-sd]',/*selector : sort direction element. Input or select element*/
            s_t_record      :   '[data-trcord]',/*selector : total number of found records. Input*/
            s_tr_div        :   '[data-ctrcord]',/*selector : User can see total number of found records in this element*/

            /*Listing pagination amd autoloading related*/
            s_pagination    :   '[data-page]',/*selector : pagination element*/
            va_pagination   :   'data-page',/*value attribute : current page value will be found in this attribute*/
            s_load_more     :   '[data-load-more="true"]',/*selector : to load more data view more element*/

            /*Ajax call related*/
            xhr_area        :   "",
            xhr_module      :   "",
            xhr_action      :   "",
            xhr_url         :   window.location.href,
            callbefore_send     :   function(jqXHR, settings){},
            callback_on_success :   function(data, textStatus, jqXHR){},
            callback_on_error   :   function(jqXHR, textStatus, errorThrown){},
            callback_on_complete:   function(jqXHR, textStatus){},
            fn_alert        :   function(mt, m){alert(m);},/*@msg_type : alert, success, error, warning, information, confirm*/

            /*Load listing data related*/
            initial_page        :   1,/*Page number at the time of plugin binding (on page load)*/
            e_pagination        :   false,/*Allow pagination or not*/
            e_autoload          :   true,/*Allow auto load as user scroll or not*/
            al_pl_upto          :   9,/*Up to 9 pages auto load will work after that user need to click on button and data will load*/
            load_on_scroll      :   true,/*Wheather to load data on scroll event or manually by clicking on load button*/
            scroll_direction    :   'DOWN',/*2 possible values [DOWN | UP ] will be option. Whether to load data on scroll up or down*/
            on_window_scroll    :   true,
            continue_autoload   :   true,/*Whether to start autoload again after [autoload_upto_page_limit] if user click on load more button*/

            fn_ShowLoading  :   function(s,l_in){},/*When something will load it will show loading message to end user*/
            fn_on_init      :   function(e){},/*Any process at the time of initialization*/
        };
        jQuery.fn.jListingManager = function(options){
            return jQuery.each(this, function(i, element){
                var $element;
                $element = jQuery(element);
                if($element.length > 0){
                    if (!$element.data(pBI) || $element.data(pBI) == null || $element.data(pBI) == ''){
                        $element.data(pBI, new jQuery.jListingManager(element, options));
                    }
                }
            });
        };
        return void 0;
    })(jQuery);
}).call(this);