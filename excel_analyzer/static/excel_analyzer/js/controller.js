

function analyzeExcel(){
	//post & analyze Excel file & get that calte
	filepath = EXCEL_FILEPATH;
	data = JSON.stringify({
		filepath: filepath,
	});
	$.post('./analyze/', {data: data}, function(data, status){
		console.log(data);
		gridData = data;
		makeGridVue();
	});
	
}

$(function(){
	analyzeExcel();
});