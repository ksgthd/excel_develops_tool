from django.shortcuts import render, redirect, reverse
from django.http import HttpResponse, Http404

# Create your views here.

import json
import os
import xlwings as xw

def index(request):
    if request.method == 'POST':
        return False

    # names = {}
    # for name in names_json:
    #     names[str(name['row']) + '_' + str(name['col_idx'])] = name

    return render(request, 'index.html')


def analyze(request):
    res = {}
    post_data = json.loads(request.POST['data'])
    filepath = post_data['filepath']
    filename = os.path.basename(filepath)
    wb = xw.Book(filepath)
    import excel_analyzer.trigger as trigger
    bookname = trigger.is_target_in_books(filename)
    if not bookname:
        return 0
    from excel_analyzer.analyzer import Grid, NamesInBooks
    nm_gttr = NamesInBooks()
    all_names = nm_gttr.get_names(bookname)
    from excel_analyzer.data_parse import names2dict_in_sheet, names_address_key_dict
    names_dict = names2dict_in_sheet(all_names)
    names_dict_in_sheet = names_address_key_dict(names_dict)
    gridder = Grid(wb=wb, names=names_dict_in_sheet)
    table_map = gridder.make_table_from_all_names(names_dict)
    res.update({
        'sheetData': table_map,
        'filepath': filepath,
        'sheets': gridder.sheets,
        'columns': gridder.make_columns(),
    })
    rt = json.dumps(res)
    return HttpResponse(rt, content_type="application/json")


def update_excel(request):
    res = {}
    post_data = json.loads(request.POST['data'])
    #print(post_data)
    if 'sheetData' not in post_data or 'filepath' not in post_data:
        return False
    filepath = post_data['filepath']
    filename = os.path.basename(filepath)
    import excel_analyzer.trigger as trigger
    bookname = trigger.is_target_in_books(filename)
    if not bookname:
        return False
    from excel_analyzer.analyzer import NamesInBooks
    nm_gttr = NamesInBooks()
    all_names = nm_gttr.get_names(bookname)
    from excel_analyzer.data_parse import names2dict_in_sheet, names_address_key_dict
    names_dict = names2dict_in_sheet(all_names)
    names_dict_in_sheet = names_address_key_dict(names_dict)
    sheet_data = post_data['sheetData']
    wb = xw.Book(filepath)
    # Update names
    for name in wb.names:
        try:
            parts = name.refers_to.split('!')
            sheetname = parts[0][1:]
            tgt_address = parts[1]
            if sheetname not in sheet_data:
                continue
            for row in sheet_data[sheetname]:
                for cell in row:
                    if 'col' not in cell:
                        continue
                    address = '$' + cell['col'] + '$' + str(cell['row'])
                    if tgt_address == address and name.name != cell['name']:
                        if cell['name'] == '' or cell['name'] is None:
                            name.delete()
                        else:
                            wb.names.add(cell['name'], name.refers_to)
                            name.delete()
                        continue
        except:
            continue

    # Add new names
    for sheetname in sheet_data:
        for row in sheet_data[sheetname]:
            for cell in row:
                if 'col' not in cell:
                    continue
                address = _address(cell['row'], cell['col_idx'], offset=0)
                if address in names_dict_in_sheet[sheetname]:
                    continue
                if not cell['name']:
                    continue
                print(cell)
                print(_refer_to(cell))
                wb.names.add(cell['name'], _refer_to(cell, sheetname=sheetname))
    res = {
        'status': True,
    }
    rt = json.dumps(res)
    return HttpResponse(rt, content_type="application/json")


def def_name_col(request):
    if request.method != 'POST':
        return False
    post_data = json.loads(request.POST['data'])
    if 'columns' not in post_data:
        return False
    filepath = post_data['filepath']
    filename = os.path.basename(filepath)
    import excel_analyzer.trigger as trigger
    bookname = trigger.is_target_in_books(filename)
    if not bookname:
        return False
    from excel_analyzer.xl_controller import Controller
    controller = Controller(filepath=filepath)
    res = {
        'status': controller.def_name_col(columns_data=post_data['columns']),
    }
    rt = json.dumps(res)
    return HttpResponse(rt, content_type="application/json")

def _address(row, col, offset=1):
    return str(row+offset)+'_'+str(col+offset)


def _refer_to(cell, sheetname=None):
    if sheetname is None:
        sheetname = cell['sheetname']
    return '=' + sheetname + '!$' + cell['col'] + '$' + str(cell['row'])
