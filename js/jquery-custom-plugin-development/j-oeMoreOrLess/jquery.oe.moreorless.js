/**
 @file : jquery.oe.moreorless.js
 @plugin : jMoreOrLess
 @description : Plugin hide some part of content and show [more] link same as at the end show [less] link
 @dependent : N/A
 **/
;(function() {
    (function($) {
        var pBI = "jMOLPBI";
        jQuery.jMoreOrLess = function(element, options) {
            var _this = this;

            this.element = element;
            this.$element = jQuery(element);
            this.$element.data(pBI, this);

            this.init = function(){
                _this._o = jQuery.extend({}, jQuery.jMoreOrLess._oDefault, options);
                _this.bound_element = _this.$element;

                /*if(!jQuery().DependentPluginName)
                {
                    console.log("Plugin : jMoreOrLess => Dependent jQuery plugins not found. Please load below dependent plugins in same order.");
                    console.log("DependentPluginName => "+typeof jQuery().DependentPluginName);
                    _this.bound_element.data(pBI,null);
                    return false;
                }*/

                _this.loading = false;
                _this.history = '';

                /*
                 Required initialization code for plugin
                 */


                _this._o.fn_on_init(this);
                return _this;
            };
            this.inactive = function(){
                /*
                 Required manipulation at the time of plugin inactivation
                 */
                _this.bound_element.data(pBI,null);
            };
            this.MethodeName = function(/*Requirement arguments*/){
                /*
                 Required logic developement
                 Like  : to get options => _this._o.your_option_name
                 to call another method => _this.YourMethodeName()
                 */
            };
            /*
             Create new methodes to develop new logic
             */
            return this.init();
        };
        jQuery.jMoreOrLess._oDefault = {

            fn_on_init : function(e){}
        };
        jQuery.fn.jMoreOrLess = function(options){
            return jQuery.each(this, function(i, element){
                var $element;
                $element = jQuery(element);
                if($element.length > 0){
                    if (!$element.data(pBI) || $element.data(pBI) == null || $element.data(pBI) == ''){
                        $element.data(pBI, new jQuery.jMoreOrLess(element, options));
                    }
                }
            });
        };
        return void 0;
    })(jQuery);
}).call(this);