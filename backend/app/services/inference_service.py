from pathlib import Path
import json
import time

from app.core.model_loader import get_model


class InferenceService:

    @staticmethod
    def run_image_inference(image_path: str, model_name: str):

        model = get_model(model_name)

        t0 = time.perf_counter()
        results = model(image_path)
        inference_ms = round((time.perf_counter() - t0) * 1000, 2)

        result = results[0]

        prediction_dir = Path("data/results/predictions")
        metadata_dir = Path("data/results/metadata")
        prediction_dir.mkdir(parents=True, exist_ok=True)
        metadata_dir.mkdir(parents=True, exist_ok=True)

        output_path = prediction_dir / Path(image_path).name
        result.save(filename=str(output_path))

        detections = []
        for box in result.boxes:
            class_id = int(box.cls[0])
            x1, y1, x2, y2 = [round(float(v), 2) for v in box.xyxy[0].tolist()]
            detections.append({
                "class_id": class_id,
                "class_name": result.names[class_id],
                "confidence": round(float(box.conf[0]), 4),
                "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                "mask_present": result.masks is not None
            })

        # Full assignment-spec metadata schema
        frame_metadata = {
            "frame_index": 0,
            "timestamp_ms": 0,
            "model": model_name,
            "detections": detections,
            "total_objects": len(detections),
            "inference_time_ms": inference_ms
        }

        metadata = {
            "filename": Path(image_path).name,
            "model": model_name,
            "frames": [frame_metadata]
        }

        metadata_path = metadata_dir / f"{Path(image_path).stem}.json"
        with open(metadata_path, "w") as f:
            json.dump(metadata, f, indent=2)

        return {
            "output_path": str(output_path),
            "metadata_path": str(metadata_path),
            "detections": len(detections)
        }