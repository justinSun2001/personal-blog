from datetime import date
import re


def data_processing(value):
    if not value:
        return []  # 返回空列表，输入数据为空时

    value_select = []
    for i in range(0, len(value)):
        if len(value[i]) < 2:
            continue  # 跳过格式不正确的数据
        value_select.append(value[i][1][0])

    keywords = ['型号', '标识', '版号/片号',  '生产批号', '检验批号', '备注', '目检合格数']
    # result = {}
    result = {'型号1': 'None', '型号2': 'None', '标识': 'None', '版号': 'None',
              '片号': 'None', '生产批号': 'None', '检验批号': 'None', '目检合格数': 'None', '备注': 'None'}

    for value in value_select:
        for keyword in keywords:
            if keyword in value:
                if '/' in keyword:
                    sub_keywords = keyword.split('/')
                    sub_values = value.split(keyword)[-1].strip()
                    # 判断是否有足够的分隔符
                    if '/' in sub_values:
                        # 如果有足够的分隔符，执行分割操作
                        values = sub_values.split('/')
                        if len(values) == 2:
                            result[sub_keywords[0]] = values[0] or None
                            result[sub_keywords[1]] = values[1] or None
                else:
                    if keyword == '型号':
                        value_parts = value.split(
                            keyword)[-1].strip().split('/')

                        if len(value_parts) == 2:
                            result['型号1'], result['型号2'] = value_parts
                        else:
                            result['型号1'], result['型号2'] = None, None
                    else:
                        result[keyword] = value.split(
                            keyword)[-1].strip() or None

    return result
