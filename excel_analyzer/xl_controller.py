import xlwings as xw
from excel_analyzer.excel import colindex2string
import excel_analyzer.excel as excel


class Controller(object):
    def __init__(self, filepath=None):
        self.filepath = filepath
        if self.filepath is not None:
            pass
        self.wb = None

    def def_name_col(self, filepath=None, columns_data=None):
        if filepath is None:
            filepath = self.filepath
        wb = xw.Book(filepath)
        wss = wb.sheets
        print(wb.names)
        for sheetname, columns in columns_data.items():
            ws = wss[sheetname]
            last_row = ws.used_range.last_cell.row
            for col, column in enumerate(columns):
                if not column['original']:
                    continue
                for row in range(last_row):
                    cell = ws.range((row+1, col+1))
                    if not cell.value or cell.value is None:
                        continue
                    if cell is None:
                        continue
                    # refer_address = '$' + colindex2string(cell.col_idx+1) + '$' + str(cell.row)
                    col_idx = cell.column
                    refer_address = '$' + excel.colindex2string(col_idx + 1) + '$' + str(cell.row)
                    ref = '=' + sheetname + '!' + refer_address
                    self.delete_name(wb, ref=ref)
                    wb.names.add(cell.value, ref)
        return True

    def delete_name(self, wb, ref=None):
        try:
            for name in wb.names:
                if name.refers_to == ref:
                    name.delete()
                    print('delete complete', ref)
        except:
            pass