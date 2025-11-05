var DefaultLocation = [];
(function(){
    jQuery.fn.geoLocation = function(options){

        var defaultVal = {
            set_default_onload: true,
            pk_selector: '#pk',

            field_country_id: 'geo_country_code',
            field_state_id: 'geo_state_id',
            field_city_id: 'geo_city_id',
            field_region_id: 'geo_region_id',

            field_first_req_type: 'GeoState',
            field_second_req_type: 'GeoCity',
            field_third_req_type: 'GeoRegion',

            call_function: function(type, option_selected, field_id, post_data){}
        };

        var obj = jQuery.extend(defaultVal, options);
        var bind_element_val = jQuery(this).val();

        if(jQuery(obj.pk_selector).length > 0)
            var pk  = jQuery(obj.pk_selector).val();
        else
            var pk  =   '';

        set_default_location();

        jQuery("select#"+obj.field_country_id).on('change',function(){
            var country_code = jQuery(this).val();
            reset_selection(obj.field_state_id);
            reset_selection(obj.field_city_id);
            reset_selection(obj.field_region_id);
            if (country_code != '')
                fill_state(country_code,'');
        });
        jQuery("select#"+obj.field_state_id).on('change',function(){
            var state_id = jQuery(this).val();
            reset_selection(obj.field_city_id);
            reset_selection(obj.field_region_id);
            if (state_id != '')
                fill_city(state_id,'');
        });
        jQuery("select#"+obj.field_city_id).on('change',function(){
            var city_id = jQuery(this).val();
            reset_selection(obj.field_region_id);
            if (city_id != '')
                fill_region(city_id,'');
        });
        function show_loading(field_id)
        {
            if (jQuery("select#"+field_id).length > 0)
                jQuery("select#"+field_id+" option:first").text("Loading...").attr('selected','selected');
        }
        function reset_selection(field_id)
        {
            if (jQuery("select#"+field_id).length > 0)
                jQuery("select#"+field_id).html("<option value=''>- select -</option>");
        }
        function get_selected_location(pk)
        {
            if (pk != '')
                obj.call_function('SelectedLocation', '', '',{'pk':pk});
        }
        function fill_state(country_code, option_selected)
        {
            if (country_code && jQuery("select#"+obj.field_state_id).length > 0)
            {
                show_loading(obj.field_state_id);
                obj.call_function(obj.field_first_req_type, option_selected, obj.field_state_id,{"field_first_post_key" : country_code});
            }
        }
        function fill_city(state_id, option_selected)
        {
            if (state_id && jQuery("select#"+obj.field_city_id).length > 0)
            {
                show_loading(obj.field_city_id);
                obj.call_function(obj.field_second_req_type, option_selected, obj.field_city_id,{"field_second_post_key":state_id});
            }
        }
        function fill_region(city_id, option_selected)
        {
            if (city_id && jQuery("select#"+obj.field_region_id).length > 0)
            {
                show_loading(obj.field_region_id);
                obj.call_function(obj.field_third_req_type, option_selected, obj.field_region_id,{"field_third_post_key":city_id});
            }
        }
        function set_default_location()
        {
            if (obj.set_default_onload == true)
            {
                setTimeout(function(){
                    if (pk != '')
                    {
                        get_selected_location(pk);

                        setTimeout(function(){

                            if (DefaultLocation[0] != '')
                                fill_state(DefaultLocation[0], DefaultLocation[1]);

                            if (DefaultLocation[1] != '')
                                fill_city(DefaultLocation[1], DefaultLocation[2]);

                            if (DefaultLocation[2] != '')
                                fill_region(DefaultLocation[2], DefaultLocation[3]);

                        },2000);
                    }
                    else if(bind_element_val != '')
                    {
                        var country_def_selected    =   jQuery("#"+obj.field_country_id).attr("data-selected");
                        var state_def_selected      =   jQuery("#"+obj.field_state_id).attr("data-selected");
                        var city_def_selected       =   jQuery("#"+obj.field_city_id).attr("data-selected");
                        var region_def_selected     =   jQuery("#"+obj.field_region_id).attr("data-selected");

                        fill_state(country_def_selected, state_def_selected);
                        fill_city(state_def_selected, city_def_selected);
                        fill_region(city_def_selected, region_def_selected);
                    }
                },500);
            }
        }
    };
})(jQuery);
