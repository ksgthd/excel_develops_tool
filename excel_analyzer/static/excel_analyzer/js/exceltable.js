
function makeGridVue(data){
	var DELIMITERS = ["[%","%]"];
	GridVue = new Vue({
		el: '#grid',
		data: {
			sheetData: gridData.sheetData,
			filepath: gridData.filepath,
			sheets: gridData.sheets,
			columns: gridData.columns,
			style: {
				column_header:{
					origin: {
						'background-color': '',
						
					}
				}
			},
		},
		methods:{
			update_excel: function(){
				var post_data = JSON.stringify({
					sheetData: this.sheetData,
					filepath: this.filepath,
				});
				console.log(post_data);
				$.post('./update_xl/', {data:post_data},function(data, status){
					console.log(data);
					if(data.status)location.reload()
				});
			},
			def_name_col: function(){
				var post_data = JSON.stringify({
					columns: this.columns,
					filepath: this.filepath,
				});
				console.log(post_data);
				$.post('./def_name_col/', {data:post_data},function(data, status){
					console.log(data);
					if(data.status)location.reload();
				});
			},
			column_name: function(idx){
				return column_name(idx);
			},
		},
		computed:{
			onOrigin: function(){
				var result = {};
				for(let sheetname in this.columns){
					result[sheetname] = {};
					for(var i=0; i<this.columns[sheetname].length; i++){
						if(this.columns[sheetname][i].original)
							result[sheetname][i] = true;
					}
				}
				return result;
			}
		},
		delimiters: DELIMITERS,
	});
}