import json
import sys
from paddleocr import PaddleOCR, draw_ocr
from PIL import Image
import os
from paddle_data_process import data_processing
import time
import logging
# 单个获取OCR结果并用图片保存


def get_ocr_data(img_path):
    # 屏蔽 PaddleOCR 日志
    logging.getLogger('ppocr').setLevel(logging.ERROR)
    sys.stdout = open(os.devnull, 'w')
    ocr = PaddleOCR(ocr_version="PP-OCRv3", enable_mkldnn=False,
                    use_angle_cls=True, det_db_box_thresh=0.3)
    sys.stdout = sys.__stdout__
    result = ocr.ocr(img_path, cls=True)
    image = Image.open(img_path).convert('RGB')
    boxes = [line[0] for line in result[0]]
    boxes_scores = [line for line in result[1]]
    txts = [line[1][0] for line in result[0]]
    scores = [line[1][1] for line in result[0]]
    all_time = result[2]['all']

    # 处理数据
    process_start = time.time()
    result = data_processing(result[0])
    process_end = time.time()

    """生成带_res后缀的目标路径"""
    # 获取原图的目录和文件名
    dir_path = os.path.dirname(img_path)  # 原图所在目录
    filename = os.path.basename(img_path)  # 原文件名（含扩展名）
    # 分割文件名和扩展名
    name_part, ext_part = os.path.splitext(filename)
    # 新文件名添加_res后缀
    new_filename = f"{name_part}_res{ext_part}"
    # 组合成新路径
    target_path = os.path.join(dir_path, new_filename)
    # 自动创建目录（如果不存在）
    os.makedirs(dir_path, exist_ok=True)
    font_path = os.path.join(dir_path, 'simfang.ttf')
    # 保存图片
    draw_start = time.time()
    im_show = draw_ocr(image, boxes, boxes_scores, txts,
                       scores, font_path=font_path)
    im_show = Image.fromarray(im_show)
    im_show.save(target_path)
    draw_end = time.time()

    return result, all_time + process_end-process_start + draw_end-draw_start, target_path


if __name__ == "__main__":
    # 接收命令行参数：图片路径、文件名（根据实际需求调整）
    if len(sys.argv) < 2:
        print(json.dumps({"error": "参数不足：需要图片路径"}))
        sys.exit(1)

    img_path = sys.argv[1]

    try:
        # 调用你的 OCR 函数
        result, time, target_path = get_ocr_data(img_path)

        # 返回结构化的 JSON 结果（包含数据 + 生成图片路径）
        output = {
            "data": result,
            "filename": os.path.basename(target_path),  # 生成的图片路径
            "time": time,
        }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({"error": str(e)}))
