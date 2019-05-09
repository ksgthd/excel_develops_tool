
ALPH = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']


def colindex2string(col_idx):
    if col_idx <= 26:
        return ALPH[col_idx-1]
    elif col_idx <= 26**2 and col_idx > 26:
        return ALPH[(col_idx//26)-1]+ALPH[(col_idx % 26)-1]


def get_index(name):
    name = name.upper()
    length = len(name)
    result = 0
    for i in range(length):
        print(name[i], ALPH.index(name[i])+1, 26**(length-1-i))
        result += (ALPH.index(name[i])+1)*(26**(length-1-i))
    return result

# test_data = [[a+b for b in ALPH] for a in ALPH]
# result = []
# for row in test_data:
#     for test in row:
#         result.append(get_index(test))
# print(result)
# before = 0
# for i in result:
#     if i != before + 1 and before != 0:
#         print('err')
#     before = i
# #print(test_data)
# print(get_index('AA'))
