# coding:utf-8
import json

from watchdog.events import FileSystemEventHandler
from watchdog.observers import Observer

import os
import time

target_dir = "./"
target_dir = r"C:\Users\kasuga takahide\Downloads\20190327_SPSイメージ"


class ChangeHandler(FileSystemEventHandler):
    def on_created(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        print('%sができました' % filename)

    def on_modified(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        import trigger
        bookname = trigger.is_target_in_books(filename)
        if not bookname:
            return 0
        from analyzer import Grid, NamesInBooks
        nm_gttr = NamesInBooks()
        all_names = nm_gttr.get_names(bookname)
        from data_parse import names2dict
        names_dict = names2dict(all_names)
        names = {}
        for name in names_dict:
            names[str(name['row']) + '_' + str(name['col_idx'])] = name
        gridder = Grid(names=names)
        table = gridder.make_table(bookname)
        excel_calte = {
            'table': table,
            'names': names,
        }
        with open('analyzed/excel_calte.json', 'w') as f:
            json.dump(excel_calte, f, indent=4)
        print(names_dict)
        print('%sを変更しました' % filename)

    def on_deleted(self, event):
        filepath = event.src_path
        filename = os.path.basename(filepath)
        print('%sを削除しました' % filename)


if __name__ in '__main__':
    while 1:
        event_handler = ChangeHandler()
        observer = Observer()
        observer.schedule(event_handler, target_dir, recursive=True)
        observer.start()
        try:
            while True:
                time.sleep(0.1)
        except KeyboardInterrupt:
            observer.stop()
        observer.join()