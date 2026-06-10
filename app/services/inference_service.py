from pathlib import Path
import json

from app.core.model_loader import get_model


class InferenceService:

    @staticmethod
    def run_image_inference(image_path: str, model_name: str):

        model = get_model(model_name)
        results = model(image_path)
        result = results[0]

        prediction_dir = Path(
            "data/results/predictions"
        )

        metadata_dir = Path(
            "data/results/metadata"
        )

        prediction_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        metadata_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        output_path = (
            prediction_dir /
            Path(image_path).name
        )

        result.save(
            filename=str(output_path)
        )

        objects = []

        for box in result.boxes:

            class_id = int(box.cls[0])

            confidence = float(box.conf[0])

            objects.append({
                "class":
                    result.names[class_id],
                "confidence":
                    round(confidence, 3)
            })

        metadata = {
            "objects": objects
        }

        metadata_path = (
            metadata_dir /
            f"{Path(image_path).stem}.json"
        )

        with open(
            metadata_path,
            "w"
        ) as f:
            json.dump(
                metadata,
                f,
                indent=4
            )

        return {
            "output_path": str(output_path),
            "metadata_path": str(metadata_path),
            "detections": len(objects)
        }