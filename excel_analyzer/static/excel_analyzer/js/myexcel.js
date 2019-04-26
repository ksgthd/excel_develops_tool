
var ALPH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
function column_name(col_idx){
	if (col_idx <= 26) {
		return ALPH[col_idx-1];
	}else if (col_idx <= 26**2) {
		return ALPH[(col_idx/26)-1]+ALPH[(col_idx % 26) -1];
	}
}