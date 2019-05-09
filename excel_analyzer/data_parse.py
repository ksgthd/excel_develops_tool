# coding: utf-8


def names2dict(names=None):
    """
    :param names: type is  xlwings.Names
    :return:
    """
    ALPH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    if names is None:
        return False
    result = []
    for name in names:
        parts = name.refers_to[1:].split('!')
        if len(parts) != 2:
            continue
        sheetname, address = parts[0], parts[1]
        if address.find('$') == -1:
            continue
        if address.find(':') > -1:
            mode = 'area'
        else:
            mode = None
        if address.count('$') == 2 and mode != 'area':
            mode = 'one'
        elif address.count('$') == 4:# TODO: To think the design for area name
            mode = 'area'
            continue
        else:
            mode = None

        col = ''
        col_idx = 0
        sep_index = 0
        for index, al in enumerate(address[1:]):
            if al not in ALPH:
                sep_index = index
                break
            col += al
        for index, al in enumerate(col):
            col_idx += (26**(len(col)-index-1))*(ALPH.index(al)+1)

        if mode == 'one':
            row = int(address[sep_index+2:])
        elif mode == 'range':
            row = int(address.split(':')[0][sep_index+2:])
        name_dict = {
            'name': name.name,
            'orgn_name': name.name,
            'col': col,
            'col_idx': col_idx,
            'row': row,
            'sheetname': sheetname,
        }
        result.append(name_dict)
    return result


def names2dict_in_sheet(names=None):
    names = names2dict(names)
    res = {}
    for name in names:
        if name['sheetname'] not in res:
           res[name['sheetname']] = [name]
        else:
            res[name['sheetname']].append(name)
    return res


def names_address_key_dict(names):
    names_dict_in_sheet = {}
    for sheetname in names:
        for name in names[sheetname]:
            if sheetname not in names_dict_in_sheet:
                names_dict_in_sheet[sheetname] = {}
            names_dict_in_sheet[sheetname][str(name['row']) + '_' + str(name['col_idx'])] = name
    return names_dict_in_sheet


