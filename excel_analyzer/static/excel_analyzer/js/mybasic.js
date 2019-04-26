function getParam(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

function post_by_ajax(Aurl, data, func){
    $.ajax({
        'url':url,
        'type':'POST',
        'data':data,
        'dataType':'json',
        'success':func,
    });
}

function getRndStr(){
  //使用文字の定義
  var str = "abcdefghijklmnopqrstuvwxyz0123456789";

  //桁数の定義
  var len = 8;

  //ランダムな文字列の生成
  var result = "";
  for(var i=0;i<len;i++){
    result += str.charAt(Math.floor(Math.random() * str.length));
  }
  return result;
}

function max_numeric_key(dictionary){
	if(dictionary=={})return 0;
    var max = -9999999;
    var key = '';
    for(key in dictionary){
        if(key>max){
            max = key;
        }
    }
    return (max<0) ? 0: max;
}



function load_template(template_filename){
    var template = '';
    post_by_ajax('../load_template/',{'json':JSON.stringify({'template_filename': template_filename})},function(response){
        template = response.template_text;
        
    });
    
}

function numberingDict(dict, rowkey, defrow){
	console.log('numberingDict');
	var defrownum = 0;
	if(defrow)
		defrownum = defrow;
	
	var rownum = 'rownum';
	if(rowkey)
		rownum = rowkey;
	
	if(!dict)return false;
	var maxrow = -999;
	var rowList = [];
	for(let key in dict){
		var row = dict[key][rownum];
		if(row!=defrownum){
			if(rowList.indexOf(row)){
				for(var i=row; i<100 ;i++){
					console.log(i);
					if(rowList.indexOf(i) == -1)
						dict[key][rownum] = i;
						var row = i
						rowList.push(i)
						break;
				}
			}else{
				rowList.push(row);
			}
		}
		if(row > maxrow)maxrow = row;
	}
	for(let key in dict){
		row = dict[key][rownum];
		if(row == defrownum){
			for(var i=maxrow+1; i<100;i++){
				
				console.log(i);
				if(rowList.indexOf(i) == -1){
					dict[key][rownum] = i;
					if(i > maxrow)maxrow = i;
					break;
				}
			}
		}else{
			
		}
	}
	return dict;
}
