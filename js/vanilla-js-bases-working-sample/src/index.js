'use strict'
class Utility{
    constructor(){}
    innerHTML(s,d){document.querySelector(s).innerHTML = d;}
    append(s,d){document.querySelector(s).innerHTML += d;}
    prepend(s,d){}
    extend(d_default, d_new){
        for(var key in d_new){
            if(d_new.hasOwnProperty(key)){
                d_default[key] = d_new[key];
            }
        }
        return d_default;
    }
}
class AjaxRequest{
    constructor(){
        this.U    =   new Utility();
        this.xhttp      =   new XMLHttpRequest();

        this.o_load = {
            url     :   '',
            method  :   'POST',
            data    :   {},
            before_call     :   function(){},
            connected_call  :   function(){},
            on_receive_call :   function(status,data,xml,headers){},
            processing_call :   function(status,data,xml,headers){},
            on_finish_call  :   function(status,data,xml,headers,statusText){},
            request_header  :   {},
        };
    }

    load(options){
        let o_load = this.U.extend(this.o_load,options);
        o_load.method = o_load.method.toUpperCase();

        this.xhttp.onreadystatechange = function() {
            /*request not initialized*/
            if (this.readyState == 0){o_load.before_call();}
            /*server connection established*/
            if (this.readyState == 1){o_load.connected_call();}
            /*request received*/
            if (this.readyState == 2){o_load.on_receive_call(this.status,this.responseText,this.responseXML,this.getAllResponseHeaders());}
            /*processing request*/
            if (this.readyState == 3){o_load.processing_call(this.status,this.responseText,this.responseXML,this.getAllResponseHeaders());}
            /*request finished and response is ready*/
            if (this.readyState == 4){o_load.on_finish_call(this.status,this.responseText,this.responseXML,this.getAllResponseHeaders(),this.statusText);}
        };

        this.xhttp.open(o_load.method, o_load.url, true);

        if(o_load.request_header.length > 0){
            for(var key in o_load.request_header){
                if(o_load.request_header.hasOwnProperty(key)){
                    this.xhttp.setRequestHeader(key, o_load.request_header[key]);
                }
            }

            if(o_load.method == 'POST' && o_load.data.length > 0){
                this.xhttp.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
            }
        }

        if(o_load.method == 'POST' && o_load.data.length > 0){this.xhttp.send(JSON.stringify(o_load.data));}
        else{this.xhttp.send();}
    }
}
class DataTable extends AjaxRequest{
    constructor(options){
        super();

        this.msg_error_apicall = 'Enable to load data through API. Please try again.';

        let o_options = {
            s_choose_currency   :   '#choosecurrency',
            s_data_search_box   :   '#datasearchbox',
            s_data_table        :   '#datatable',
            s_dt_head           :   '#datatable thead',
            s_dt_body           :   '#datatable tbody',
            s_dt_foot           :   '#datatable tfoot',
            s_alert_success     :   '#alert-success',
            s_alert_error       :   '#alert-error',


            list_currency       :   {'EUR':'EUR','GBP':'GBP','ZAR':'ZAR','NZD':'NZD'},
            def_currency        :   'ZAR',

            list_columns        :   {
                'rank': {'title':'Rank','iscb':false,'updown':false},
                'name': {'title':'Name','iscb':false,'updown':false},
                'symbol': {'title':'Symbol','iscb':false,'updown':false},
                'price_*': {'title':'Price','iscb':true,'updown':false},
                '24h_volume_*': {'title':'24h Volume','iscb':true,'updown':false},
                'market_cap_*': {'title':'Market Cap','iscb':true,'updown':false},
                'percent_change_1h': {'title':'% Change in last hour','iscb':false,'updown':true},
                'percent_change_24h': {'title':'% Change in last 24 hours','iscb':false,'updown':true},
                'percent_change_7d': {'title':'% Change in last 7 days','iscb':false,'updown':true},
            },

            api                 :   {
                mail_url    :   'https://api.coinmarketcap.com/v1/ticker/',
                p_limit     :   'limit',
                p_start     :   'start',
                p_convert   :   'convert',

            }
        };
        this.o_dt = this.U.extend(o_options,options);
        this.cur_currency = this.o_dt.def_currency;
        this.init();
    }
    init(){
        this.AddChooseCurrencyOption();
        this.BindCurrencyChangeEvent();
        this.BindSearchBoxEvent();
        this.LoadDataInTable();
    }
    AddChooseCurrencyOption(){
        this.U.innerHTML(this.o_dt.s_choose_currency,'<option value="">Choose Currency</option>');

        for(var key in this.o_dt.list_currency){
            let s='';let item = this.o_dt.list_currency[key];
            if(item == this.o_dt.def_currency){s = 'selected="selected"'}
            this.U.append(this.o_dt.s_choose_currency,'<option value="'+key+'" '+s+'>'+item+'</option>');
        }
    }
    AddTableHead(){
        let temp; let item; let head = '<tr>';

        for(var key in this.o_dt.list_columns){

            item = this.o_dt.list_columns[key];
            temp=item.title;
            if(item.iscb == true){
                temp = item.title + ' <small>('+this.cur_currency+')</small>';
            }
            head += '<th title="click to sort" scope="col" class="align-top cursor-pointer font-weight-bold">'+temp+'</th>';
        }

        head += '</tr>';

        this.U.innerHTML(this.o_dt.s_dt_head, head);

        this.BindColumnSortingEvent();
    }
    BindColumnSortingEvent(){
        let _this = this;
        let thead = document.querySelector(this.o_dt.s_dt_head);
        let thitem = thead.getElementsByTagName("th");
        for (var i = 0; i < thitem.length; ++i) {
            thitem[i].addEventListener('click',function(){
                _this.SortDataInColumn(this.cellIndex);
            });
        }
    }
    SortDataInColumn(n) {
        let table, rows, switching, i, x, y, shouldSwitch, dir, switchcount = 0;
        table = document.querySelector(this.o_dt.s_data_table);
        switching = true;
        dir = "asc";
        while (switching) {
            switching = false;
            rows = table.getElementsByTagName("TR");
            for (i = 1; i < (rows.length - 1); i++) {
                shouldSwitch = false;
                x = rows[i].getElementsByTagName("TD")[n];
                y = rows[i + 1].getElementsByTagName("TD")[n];
                if (dir == "asc") {
                    if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
                        shouldSwitch= true;
                        break;
                    }
                } else if (dir == "desc") {
                    if (x.innerHTML.toLowerCase() < y.innerHTML.toLowerCase()) {
                        shouldSwitch= true;
                        break;
                    }
                }
            }
            if (shouldSwitch) {
                rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
                switching = true;
                switchcount ++;
            }
            else {

                if (switchcount == 0 && dir == "asc") {
                    dir = "desc";
                    switching = true;
                }
            }
        }
    }
    LoadDataInTable(){
        let _this = this;
        let apiurl = this.o_dt.api.mail_url + '?' + this.o_dt.api.p_convert + '=' + this.cur_currency;

        this.load({
            url     :   apiurl,
            method  :   'GET',
            data    :   {},
            before_call     :   function(){},
            connected_call  :   function(){},
            on_receive_call :   function(status,data,xml,headers){},
            processing_call :   function(status,data,xml,headers){},
            on_finish_call  :   function(status,data,xml,headers,statusText){
                if(status == 200){
                    _this.AddTableHead();

                    let cd=''; let temp; let resp = JSON.parse(data);
                    /*console.log(resp);*/
                    resp.forEach(function(item,index){
                        cd += '<tr>';

                        for(var key in _this.o_dt.list_columns){
                            temp=key;
                            if(_this.o_dt.list_columns[key].iscb == true){
                                temp = (key.replace('*',_this.cur_currency)).toLowerCase();
                            }

                            cd += '<td scope="col" class="align-top">';

                            if(_this.o_dt.list_columns[key].updown == true){
                                if(item[key] < 0){
                                    cd += '<label class="text-danger">&nabla;</label>';
                                }
                                else if(item[key] > 0){
                                    cd += '<label class="text-success">&Delta;</label>';
                                }
                                else{
                                    cd += '<label class="text-dark">-</label>';
                                }
                                cd += ' ';
                            }
                            cd += item[temp]+'</td>';
                        }
                        cd += '</tr>';

                        _this.U.innerHTML(_this.o_dt.s_dt_body,cd);

                    });
                }
                else{
                    _this.U.innerHTML(_this.o_dt.s_alert_error,_this.msg_error_apicall);
                    document.querySelector(_this.o_dt.s_alert_error).style.display = 'block';
                }
            },
            request_header  :   {}
        });
    }
    BindCurrencyChangeEvent(){
        let _this = this;
        document.querySelector(this.o_dt.s_choose_currency).addEventListener('change',function(){
            if(this.value != '' && this.value in _this.o_dt.list_currency){
                _this.cur_currency = this.value;
                _this.LoadDataInTable();
            }
        });
    }
    BindSearchBoxEvent(){
        let _this = this;
        document.querySelector(this.o_dt.s_data_search_box).addEventListener('keyup',function(){
            _this.SearchDataInTable(this.value);
        });
    }
    SearchDataInTable(q) {
        let filter, table, tr, td, i, alltd, temp;
        filter = q.toUpperCase();
        table = document.querySelector(this.o_dt.s_dt_body);
        tr = table.getElementsByTagName("tr");

        for (i = 0; i < tr.length; i++) {
            temp=false; alltd = tr[i].getElementsByTagName("td");
            for(var key in alltd){
                if(isNaN(key) == false){
                    td = alltd[key]
                    if (td) {
                        if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
                            temp = true;
                        }
                    }
                }
            }
            if (temp == true) {
                tr[i].style.display = "";
            } else {
                tr[i].style.display = "none";
            }
        }
    }
}
new DataTable({/*Your custom options*/});