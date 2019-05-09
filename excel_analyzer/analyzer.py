# coding: utf-8
import xlwings as xw


class NamesInBooks(object):
    def __init__(self):
        pass

    def get_names(self, filepath):
        wb = xw.Book(filepath)
        # wb.names.add('test', '=CTL!$B$1')
        # wss = wb.sheets
        # ws = wss.active
        # used_range = ws.range(ws.used_range)
        #used_range = wb.range(wb.names)
        return wb.names


COL_TEMPLATE = {
    'value': '',
    'original': False,
}


class Grid(object):
    def __init__(self, wb=None, names=None):
        if names is None:
            self.names = {}
        else:
            self.names = names

        if wb is None:
            self.wb = None
        else:
            self.wb = wb
        self.sheets = []
        self.table_map = {}


    def make_columns(self):
        result = {}
        for sheet in self.sheets:
            if sheet in self.table_map:
                result[sheet] = [COL_TEMPLATE.copy() for i in range(len(self.table_map[sheet][0]))]
        return result


    def make_table(self, filepath):
        wb = xw.Book(filepath)
        wss = wb.sheets
        res = {}
        for ws in wss:
            rng = ws.range(ws.used_range)
            print(ws.used_range)
            print('rng', len(rng.rows), len(rng.rows[0]))
            table = []
            for i, cell in enumerate(ws.cells):
                print(i, cell)
            for row_num, row in enumerate(rng.rows):
                r = []
                for col_num, cell in enumerate(row):
                    print(row_num, col_num)
                    address = self.address(row_num, col_num)
                    if address in self.names:
                        if self.names[address]['sheetname'] == ws.name:
                            table.append(self.names[address])
                            continue
                    r.append({})
                table.append(r)
            res[ws.name] = table
        return res

    def make_table_from_all_names(self, all_names=None):
        import excel_analyzer.excel as xl
        if self.wb is None:
            return False
        for sheet in self.wb.sheets:
            self.sheets.append(sheet.name)
        result = {}
        wss = self.wb.sheets
        for sheetname in self.sheets:
            if sheetname in all_names:
                print(all_names)
                max_row, max_col = _max_range_table_type_dict(all_names[sheetname], sheetname=sheetname)
                if max_row < 30:
                    max_row = 30
                if max_col < 25:
                    max_col = 28

            else:
                max_row, max_col = 30, 28
            table_map = []
            area = wss[sheetname].range((1,1), (max_row, max_col)).value
            for i in range(max_row):
                row = []
                for j in range(max_col):
                    if area[i][j] is None:
                        value = ''
                    else:
                        value = area[i][j]
                    if type(value) is not str:
                        value = ''
                    cell = {
                        'col': xl.colindex2string(j+1),
                        'col_idx': j+1,
                        'row': i+1,
                        'name': '',
                        'orgn_name': '',
                        'sheetname': sheetname,
                        'value': value,
                    }
                    #print(ws.range((i+1, j+1)).value)
                    if sheetname in self.names:
                        if self.address(i, j) in self.names[sheetname]:
                            cell.update(self.names[sheetname][self.address(i, j)])
                    row.append(cell)
                table_map.append(row)
            result[sheetname] = table_map
        self.table_map = result
        return result

    def address(self, row_num, col_num):
        return str(row_num + 1) + '_' + str(col_num + 1)


def _max_range_table_type_dict(all_names, sheetname=''):
    max_row = 0
    max_col = 0
    for name in all_names:
        if sheetname:
            if name['sheetname'] != sheetname:
                continue
        if name['row'] > max_row:
            max_row = name['row']
        if name['col_idx'] > max_col:
            max_col = name['col_idx']
    return max_row, max_col


def _table_arr(row, col):
    pass

if __name__ == '__main__':
    nm_gttr = NamesInBooks()
    nm_gttr.get_names('excel_analyzer_testBook.xlsx')
