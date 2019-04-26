# coding: utf-8

import xlwings as xw

# class (object):
#     def __init__(self):
#         pass
#
#     def do(self):
#         pass
#
#     def trigger(self):
#         self.do()
#
#     def

# target_path = r'C:\Users\kasuga takahide\Downloads\20190327_SPSイメージ\SPS 06 シート - ① 引合情報.xlsx'
target = 'Book1'

def is_target_in_books(bookname):
    wbs = xw.books
    is_found = 0
    for wb in wbs:
        # print(wb.name)
        if bookname == wb.name:
            is_found = bookname
            break
    if not is_found:
        return False
    return bookname

book = is_target_in_books(target)
print(book)
