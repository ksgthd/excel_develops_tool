console.log("LOAD COMPLETE: vue-table.js sample vuejs file");

//基本サンプル&デリメータ変更サンプル
var DELIMITERS = ["[%","%]"];
var list_sample = new Vue({
    el: '#app1',
    data: {
        title: 'table title',
        users: [
            {
                id: 1,
                name: '鈴木太郎',
                email: 'suzukitaro@example.com'
            },
            {
                id: 2,
                name: '佐藤二郎',
                email: 'satoujiro@example.com'
            },
            {
                id: 3,
                name: '田中三郎',
                email: 'tanakasaburo@example.com'
            },
            {
                id: 4,
                name: '山本四郎',
                email: 'yamamotoshiro@example.com'
            },
            {
                id: 5,
                name: '高橋五郎',
                email: 'takahashigoro@example.com'
            },
        ]
    },
    delimiters: DELIMITERS,
});


function max_id_arrayDict(arrayDict, id_key='id'){
    var max_id = -99;
    for(let dict of arrayDict){
        if(max_id < dict[id_key]){
            max_id = dict[id_key];
        } 
    }
    return max_id;
}


//templateを使わないソートテーブルサンプル
var app = new Vue({
    delimiters: DELIMITERS,
    el: '#app',
    data: function () {
        var columns = {
            id: 'ID',
            subject: '件名',
            category: 'カテゴリ',
            date: '日付'
        };
        var sortOrders = {};
        Object.keys(columns).forEach(function (key) {
            sortOrders[key] = 1
        });
        return {
            columns: columns,
            tasks: [
                {
                    id: 1,
                    subject: 'タスク1',
                    category: 'カテゴリー1',
                    date: '2016-12-01'
                },
                {
                    id: 2,
                    subject: 'タスク2',
                    category: 'カテゴリー2',
                    date: '2016-12-02'
                },
                {
                    id: 2,
                    subject: 'タスク0',
                    category: 'カテゴリー0',
                    date: '2016-12-00'
                },
                {
                    id: 2,
                    subject: 'タスク3',
                    category: 'カテゴリー0',
                    date: '2016-12-00'
                },
            ],
            sortKey: '',
            sortOrders: sortOrders,
            // 検索文字列
            searchWord: '',
        }
    },
    methods: {
        sortBy: function(key) {
            this.sortKey = key;
            this.sortOrders[key] = this.sortOrders[key] * -1;
        }
    },
    computed: {
        filteredTasks: function () {
            var data = this.tasks;

            var sortKey = this.sortKey;
            var order = this.sortOrders[sortKey] || 1;
            
            var filterWord = this.searchWord && this.searchWord.toLowerCase();
            
            if(filterWord) {
                data = data.filter(function (row) {
                    return Object.keys(row).some(function (key) {
                        return String(row[key]).toLowerCase().indexOf(filterWord) > -1
                    })
                })
            }
            
            if (sortKey) {
                data = data.slice().sort(function(a, b){
                    a = a[sortKey];
                    b = b[sortKey];
                    return (a === b ? 0 : a > b ? 1 : -1) * order;
                });
            }
            return data;
        }
    }
});
function sheets_var(){
                console.log(sheets_vue);
            }
$(function(){
    var name_list = [];
    var app = new Object();
    
    sheets_vue = {main:app};
    /*------------------------------------------------------------
    リストコンポーネント管理画面のvue
    */
    var listcompview = '';
	
    var cardcompview = '';
    
    //^^^^^^^^^^^^^^^^^^リストコンポーネント管理画面のVue^^^^^^^^^^^^^^^^^^^^^
    
    var cellname_searchtable= '';
    
    /*------------------------------------------------------------
    SQL編集ウィンドウのvue
    */
    var sqlview = '';
    
    //^^^^^^^^^^^^^^^^^^SQL編集ウィンドウのVue^^^^^^^^^^^^^^^^^^^^^
    
    
    var example2 = new Vue({
      el: '#example-2',
      data: {
        name: 'Vue.js'
      },
      // `methods` オブジェクトの下にメソッドを定義する
      methods: {
        greet: function (event) {
          // メソッド内の `this` は、 Vue インスタンスを参照します
          alert('Hello ' + this.name + '!')
          // `event` は、ネイティブ DOM イベントです
          if (event) {
            alert(event.target.tagName)
          }
        }
      }
    })
});

function setting_view_vue(){
	settingview = new Vue({
        delimiters: DELIMITERS,
        el: '#setting_view',
        data: {
			projectData:project_data,
        },
        methods:{
			
		},
	});
	return settingview;
}

function sql_content_view_vue(){
    sqlview = new Vue({
        delimiters: DELIMITERS,
        el: '#sql_view',
        data: {
            sql_tab_id: 'sql_tab_',
            sql_result_panel_id: 'sql_result_panel_',
            sql_text: project_data.sql_text,
            sql_text_org: project_data.sql_text_org,
            sql_name: project_data.sql_name,
            sql_filename: project_data.sql_filename,
            mynewSQLnum: 1,
			exe: executeFlag,
        },
        methods:{
			save_sql: function(){
				
			},
            addSQL: function(){
                var max_sql_no = max_numeric_key(this.sql_text);
                var new_sql_no = Number(max_sql_no) + 1;
                var new_sql_name =  '新規'+this.mynewSQLnum;
                this.$set(this.sql_text, new_sql_no, '');
                this.$set(this.sql_text_org, new_sql_no, '');
                this.$set(this.sql_name, new_sql_no, {
                    value: new_sql_name,
                    org:new_sql_name,
                });
                this.$set(this.sql_filename, new_sql_no, new_sql_name + '.sql');
                this.mynewSQLnum++;
                console.log('max_sql_no', max_sql_no);
                console.log('sql_text', this.sql_text);
                console.log('sql_org', this.sql_text_org);
                console.log('sql_name', this.sql_name);
                
            },
            execute: function(sql_no){
				var paramSQL = get_cell_param(this.sql_text[sql_no]);
				console.log(paramSQL);
				if(!paramSQL){
					paramSQL = this.sql_text[sql_no];
				}
				console.log(paramSQL);
                var send_data = {'sql': paramSQL, option:{}};
                var result_panel_id = this.result_panel_id;
                post_by_ajax('../sql_execute/',{
                            'json': JSON.stringify(send_data)
                    },function(response){
                    var data = {nothing:1}
                    data = response;
                    console.log(data);
                    console.log(this.result_panel_id);
                    var result_panel = $('#' + result_panel_id(sql_no));
                    if(data.status == 0){
                        result_panel.empty().html(data.table);
                    }else if(data.status == -99){
                        result_panel.empty().html(data.errMessage + '\n' + data.errSQL);
                    }
                });
            },
            sqlNaming_Save: function(sql_no){
                console.log(sql_no, this.sql_name[sql_no]);
                this.sql_name[sql_no].org =this.sql_name[sql_no].value;
            },sqlNaming_Back: function(sql_no){
                console.log(sql_no, this.sql_name[sql_no]);
                this.sql_name[sql_no].value = this.sql_name[sql_no].org;
            },
            tab_id: function(sql_no_){
                return this.sql_tab_id + sql_no_;  
            },
            result_panel_id: function(sql_no_){
                return this.sql_result_panel_id + sql_no_;  
            },
            check: function(sql_no){
                console.log('now sql data', this.sql_text[sql_no]);
                console.log('original sql data', this.sql_text_org[sql_no]);
            },
        }
    });
    $('.sql_tab_bar ul li').eq(0).addClass('active');
    $('.sql_comp_panels div').eq(0).addClass('active');
}

function edit_menu_box_vue(){
    var editmenu = new Vue({
        delimiters: DELIMITERS,
        el: '#edit_menu',
        data: {
			debug:project_data.debug,
            view: {
					views: viewsview.view,
                    'card': cardcompview.view,
                    'list': listcompview.view,
                    'sql': false,
                    
            },
        },
        methods:{
			test: function(){return false;},
			save_project: function(){
				var send_data = {
					project_data: project_data,
					project_id: project_data.project_id,
				};
				console.log(send_data);
				post_by_ajax('../save_project/',
				 {'json': JSON.stringify(send_data)},function(data){
					console.log(data);
					if(data.status){
						alert('保存が完了しました。');
					}
				});
			},
            view_change: function(type){
                for(t in this.view){
                    this.view[t].this = false;
                }
                this.view[type].this = true;
                console.log(this.view);
            },
			debug_switch: function(){
				console.log(this.debug);
					
			},
        },
    });
	return editmenu;
    
}



function cellname_searchtable_vue(nameDict){
    console.log('cellnameSearch Vue', nameDict);
    cellname_searchtable = new Vue({
        delimiters: DELIMITERS,
        el: '#cellnamesearch_modal',
        data: {
            keyword: '',
            pre_keyword: '',
            nameDict: nameDict,
            ishovered: false,
            hovered_cellname: '',
            from_id: '',
        },
        methods: {
            back:function(cellname){
				//project_data.LISTS[this.from_id].range = cellname;
                //this.keyword = cellname;7
				this.from_id[0][this.from_id[1]] = cellname;
                //$('#'+this.from_id).val(cellname);
                console.log(this.from_id);
            },
            names_row_hover: function(cellname){
                //@mouseover="names_row_hover(name)" @mouseleave="names_row_leave"
                if(!this.ishovered){
                    this.pre_keyword = this.keyword;
                    console.log(this.pre_keyword);
                }
                this.ishovered = !this.ishovered;
                this.keyword = cellname;
            },
            names_row_leave: function(){
                if(this.ishoverd)
                    this.ishovered = !this.ishovered;
                this.keyword = this.pre_keyword;
            },
        },
        computed: {
            searh_cellname:function(){
                if(this.keyword){
                    var nameDict = {};
                    for(name in this.nameDict){
                        if(name.indexOf(this.keyword) !== -1)
                            nameDict[name]=this.nameDict[name];
                    }
                    return nameDict;
                }else{
                    return this.nameDict
                }
            },
            
        },
    });
}


function init_view_contents(project_data,data){
	sql_content_view_vue();
	setting_view_vue();
    //カードコンポーネント管理画面の初期化
    var card_ = card_component_view_vue(project_data, data);
    
    //リストコンポーネント管理画面の初期化
    var list_ =list_component_view_vue(project_data, data);
    
    //セル検索モーダルの初期化
    cellname_searchtable_vue(data.namesDict);
	
	//画面管理画面の初期化
	var comps = {
		'card_comp': card_,
		'list_comp': list_,
	}
	views_vue(project_data, data, comps);
	
	//編集メニュー初期化
    editmenu = edit_menu_box_vue();
    
    
}
