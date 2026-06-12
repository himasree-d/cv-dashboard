from ultralytics import YOLO

DETECTION_MODEL = YOLO("yolov8n.pt")

SEGMENTATION_MODEL = YOLO("yolov8n-seg.pt")


def get_model(model_name: str):
    if model_name == "yolov8n":
        return DETECTION_MODEL

    if model_name == "yolov8n-seg":
        return SEGMENTATION_MODEL

    raise ValueError(
        f"Unsupported model: {model_name}"
    )