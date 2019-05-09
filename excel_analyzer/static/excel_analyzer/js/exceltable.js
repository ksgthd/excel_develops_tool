
function makeGridVue(data){
	var DELIMITERS = ["[%","%]"];
	GridVue = new Vue({
		el: '#grid',
		data: {
			sheetData: gridData.sheetData,
			filepath: gridData.filepath,
			sheets: gridData.sheets,
			columns: gridData.columns,
			pointer:{
				col: 'A',
				row: 1,
			},
			style: {
				changedCell:{
					'background-color': '#87ceeb',	
				},
				changedCell_empty:{
					'background-color': '#696969',
				},
				column_header:{
					origin: {
						'background-color': '',
						
					}
				},
				address_pop:{
					top: 0,
					left: 0,
				},
				
			},
			display:{
				cell: 'name',	
			},
			DRAGDROP:{
				sheetname: '',
				col_idx: '',
				row: '',
				name: '',
			}
		},
		methods:{
			chngDisp: function(){
				var dispMode = ['name', 'value'];
				var index = dispMode.indexOf(this.display.cell);
				console.log(index);
				if (index == (dispMode.length-1)) {
					this.display.cell = dispMode[0];
				}else{
					this.display.cell = dispMode[index+1];
				}
			},
			restore_name: function(selectCell){
				var p = this.sheetData[selectCell.sheetname][selectCell.row-1][selectCell.col_idx-1];
				if (p) {
					console.log(p.orgn_name);
					p.name = p.orgn_name;
				}
			},
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
			address_pop: function(e, col, row){
				this.style.address_pop = {
					top: (e.pageY - e.offsetY - 30) + 'px',
					left: (e.pageX - e.offsetX) + 'px',
				};
				this.pointer.col = col;
				this.pointer.row = row;
			},
			drag: function(dragCell){
				console.log('drag');
				this.DRAGDROP.sheetname = dragCell.sheetname;
				this.DRAGDROP.col_idx = dragCell.col_idx;
				this.DRAGDROP.row = dragCell.row;
				this.DRAGDROP.name = dragCell.name;
			},
			drop: function(dropCell){
				var dd = this.DRAGDROP;
				if (dd.name == '' )return false;
				if (dropCell.col_idx == dd.col_idx && dropCell.row == dd.row)return false;
				console.log('drop');
				dropCell.name = this.DRAGDROP.name;
				this.DRAGDROP.name = '';
				this.sheetData[dd.sheetname][dd.row-1][dd.col_idx-1] .name = '';
			}
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