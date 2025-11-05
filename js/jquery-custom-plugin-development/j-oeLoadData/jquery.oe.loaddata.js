/**
 @ jLoadData load data by pagination or as per scroll by user in any direction
 **/
(function() {
    (function($) {
        var BoundIdentifier = "jLDBI";
        jQuery.jLoadData = function(element, options) {
            var _this = this;

            this.element = element;
            this.$element = jQuery(element);
            this.$element.data(BoundIdentifier, this);

            this.init = function(){
                _this._o = jQuery.extend({}, jQuery.jLoadData.defaultOptions, options);

                _this.loading = false;
                _this.bound_element = _this.$element;
                _this.min_scroll_down_at = 270;
                _this.cur_page = _this._o.initial_page;
                _this.load_type = {0:'Append', 1:'Prepend', 2:'Assign'};
                _this.al_pl_upto = _this._o.al_pl_upto;

                _this.element_result_container = _this.bound_element.find(_this._o.s_result_div);

                _this.ScrollTo();
                _this.BindLoadMoreResultButton();
                _this.BindScrollEvent();
                _this.BindPagination();

                return _this;
            };
            this.InactivePlugin = function(){
                _this.UnBindScrollEvent();
                _this.UnBindLoadMoreResultButton();
                _this.UnBindPagination();

                _this.bound_element.data(BoundIdentifier,null);
            };
            this.GetFormData = function(form_selector){
                var form_data = jQuery(form_selector).serializeArray();
                return form_data;
            };
            this.GetSearchResult = function(load_type,load_page,intention){

                if(!load_type || load_type == ''){
                    load_type = _this.load_type[2];
                }
                if(!intention || intention == ''){
                    intention = 'scroll';
                }

                if(!load_page || load_page == ''){
                    var page_num = (parseFloat(_this.cur_page)+1);
                }
                else{
                    var page_num = load_page;
                }

                _this.LoadMoreResult(load_type,page_num,intention);
            };
            this.LoadMoreResult = function(load_type,page_num,intention){
                if(Loading == false)
                {
                    _this.cur_page = parseFloat(page_num);
                    var search_param = _this.GetFormData(_this._o.s_sc_form);
                    jQuery.merge(search_param, _this.GetFormData(_this._o.s_sf_form));
                    search_param.push({name: 'page', value: _this.cur_page});
                    search_param.push({name: 'intention', value: intention});
                    search_param.push({name: 'load_type', value: load_type});
                    search_param.push({name: 'load_direction', value: _this._o.scroll_direction});
                    search_param.push({name: 's_bound_id', value: _this.bound_element.attr('id')});
                    search_param.push({name: 's_result_div', value: _this._o.s_result_div});
                    search_param.push({name: 's_lbm_div', value: _this._o.s_lbm_div});
                    search_param.push({name: 's_load_button', value: _this._o.s_load_button});
                    search_param.push({name: 's_sf_form', value: _this._o.s_sf_form});
                    search_param.push({name: 's_sc_form', value: _this._o.s_sc_form});
                    search_param.push({name: 's_pagination_div', value: _this._o.s_pagination_div});
                    _this._o.fn_load_result(search_param);
                }
            };
            this.ScrollTo = function(scroll_height){
                if(_this._o.e_autoload === true)
                {
                    if(_this._o.scroll_direction == 'UP')
                    {
                        _this.objRC = _this.bound_element[0];
                        if(!scroll_height)
                        {
                            scroll_height = _this.objRC.scrollHeight;
                        }
                        _this.objRC.scrollTop = (scroll_height);
                    }
                }
            };
            this.BindPagination = function(){
                if(_this._o.e_pagination === true)
                {
                    _this.element_pagination_pagenumber = jQuery(_this._o.s_page_num);
                    if(_this.element_pagination_pagenumber.length > 0)
                    {
                        _this.element_pagination_pagenumber.each(function(index){
                            var ele_attr = jQuery(this).attr('href');
                            if(typeof ele_attr !== typeof undefined && ele_attr !== false)
                            {
                                jQuery(this).attr('href','javascript:void(0);');
                            }
                            jQuery(this).unbind('click');
                            jQuery(this).on('click',function(){
                                var page_num = jQuery(this).attr(_this._o.va_page_num);
                                _this.GetSearchResult(_this.load_type[2],page_num,'paging');
                            });
                        });
                    }
                }
            };
            this.UnBindPagination = function(){
                if(_this._o.e_pagination === true)
                {
                    if(_this.element_pagination_pagenumber.length > 0)
                    {
                        _this.element_pagination_pagenumber.each(function(index){
                            jQuery(this).unbind('click');
                        });
                    }
                }
            };
            this.BindScrollEvent = function(){
                if(_this._o.e_autoload === true)
                {
                    if(_this._o.load_on_scroll == true)
                    {
                        if(_this._o.on_window_scroll == true)
                        {
                            _this.scroll_on = jQuery(window);
                            _this.old_scroll_top = _this.scroll_on.scrollTop();
                            _this.scroll_on.on('scroll', function(){
                                var element_load_more_result_button = jQuery(_this._o.s_load_button);
                                if(element_load_more_result_button.length == 1)
                                {
                                    var load_more       =   element_load_more_result_button.offset().top.toFixed(0);
                                    var win_top         =   _this.scroll_on.scrollTop();
                                    var win_height      =   _this.scroll_on.height();

                                    /*var _a_ = {load_more:load_more, cal:(win_top+win_height+400), win_top:win_top, win_height:win_height};
                                     console.log(_a_);*/

                                    if(_this._o.scroll_direction == 'DOWN' && _this.cur_page <= _this._o.al_pl_upto)
                                    {
                                        if ((load_more <= (win_top+win_height+400)))
                                        {
                                            _this.GetSearchResult(_this.load_type[0]);
                                        }
                                    }
                                    else if(_this._o.scroll_direction == 'UP')
                                    {

                                        if (_this.old_scroll_top > win_top && win_top <= 300)
                                        {
                                            _this.GetSearchResult(_this.load_type[1]);
                                        }
                                    }
                                    _this.old_scroll_top = win_top;
                                }
                            });
                        }
                        else
                        {
                            _this.scroll_on = _this.bound_element;
                            _this.old_scroll_top = _this.scroll_on.scrollTop();
                            _this.scroll_on.on('scroll', function(){
                                var element_load_more_result_button = jQuery(_this._o.s_load_button);
                                if(element_load_more_result_button.length == 1)
                                {
                                    var load_more       =   element_load_more_result_button.offset().top.toFixed(0);
                                    var ele_top         =   _this.scroll_on.scrollTop();
                                    var ele_height      =   _this.scroll_on.height();

                                    /*var _a_ = {load_more:load_more, cal:((ele_top+ele_height)-1000), ele_top:ele_top, ele_height:ele_height};
                                     console.log(_a_);*/

                                    if(_this._o.scroll_direction == 'DOWN')
                                    {
                                        if ((load_more <= ((ele_top+ele_height))))
                                        {
                                            _this.GetSearchResult(_this.load_type[0]);
                                        }
                                    }
                                    else if(_this._o.scroll_direction == 'UP')
                                    {
                                        /*console.log(_this.element_result_container.children(":nth-child(1)"));*/
                                        if (_this.old_scroll_top > ele_top && ele_top == 0)
                                        {
                                            _this.ScrollTo(_this.min_scroll_down_at);
                                            _this.GetSearchResult(_this.load_type[1]);
                                        }
                                    }
                                    _this.old_scroll_top = ele_top;
                                }
                            });
                        }
                    }
                }
            };
            this.UnBindScrollEvent = function(){
                if(_this._o.e_autoload === true){_this.scroll_on.unbind('scroll');}
            };
            this.BindLoadMoreResultButton = function(){
                if(_this._o.e_autoload === true)
                {
                    _this.element_load_more_result_button = jQuery(_this._o.s_load_button);

                    _this.element_load_more_result_button.unbind('click');
                    if(_this.element_load_more_result_button.length == 1)
                    {
                        if(_this.cur_page == 1){
                            _this._o.al_pl_upto = _this.al_pl_upto;
                        }

                        _this.element_load_more_result_button.on('click',function(){

                            if(_this._o.continue_autoload === true)
                            {
                                _this._o.al_pl_upto = parseFloat(parseFloat(_this.cur_page) + parseFloat(_this.al_pl_upto));
                            }

                            var load_type = _this.load_type[0];
                            if(_this._o.scroll_direction == 'UP')
                            {
                                _this.ScrollTo(_this.min_scroll_down_at);
                                load_type = _this.load_type[1];
                            }
                            _this.GetSearchResult(load_type);
                        });
                    }
                }
            };
            this.UnBindLoadMoreResultButton = function(){
                if(_this.element_load_more_result_button){_this.element_load_more_result_button.unbind('click');}
            };

            return this.init();
        };
        jQuery.jLoadData.defaultOptions = {
            initial_page:1,/*Page number at the time of plugin binding (on page load)*/
            e_pagination: false,/*Allow pagination or not*/
            e_autoload: true,/*Allow auto load as user scroll or not*/

            al_pl_upto : 9,/*Up to 9 pages auto load will work after that user need to click on button and data will load*/
            load_on_scroll: true,/*Wheather to load data on scroll event or manually by clicking on load button*/
            scroll_direction: 'DOWN',/*2 possible values [DOWN | UP ] will be option. Whether to load data on scroll up or down*/
            on_window_scroll: true,
            continue_autoload: true,/*Whether to start autoload again after [al_pl_upto] if user click on load more button*/

            s_result_div: '#result-container',/*Container which hold all search result*/
            s_lbm_div: '#loading-btnmsg-container',/*container which hold button and no more result found message*/
            s_load_button: '#element-load-more-result',/*Button element which also use to load more result*/
            s_sf_form: '#search-filter-form',/*form for search parma to filter data from database*/
            s_sc_form: '#search-criteria-form',/*form to set search result criteria like page size, sort order etc*/
            s_pagination_div: '#pagination-container',/*Container which hold pagination links*/
            s_t_record: '#t-records',/*Input hidden which hold total number of found records*/
            va_page_num: 'data-load-page',/*Attribute to get clicked page number*/

            fn_load_result: function(search_param){}/*function which will give you search_param and need to get & show data based on that. Do you manipulation in this function*/
        };
        jQuery.fn.jLoadData = function(options){
            return jQuery.each(this, function(i, element){
                var $element;
                $element = jQuery(element);
                if($element.length > 0){
                    if (!$element.data(BoundIdentifier) || $element.data(BoundIdentifier) == null || $element.data(BoundIdentifier) == ''){
                        $element.data(BoundIdentifier, new jQuery.jLoadData(element, options));
                    }
                }
            });
        };
        return void 0;
    })(jQuery);
}).call(this);