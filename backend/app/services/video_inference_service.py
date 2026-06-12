from pathlib import Path
import cv2
import json
import time

from app.core.model_loader import get_model


class VideoInferenceService:

    @staticmethod
    def run_video_inference(video_path: str, model_name: str):

        model = get_model(model_name)

        input_path = Path(video_path)

        output_dir = Path("data/results/videos")
        output_dir.mkdir(parents=True, exist_ok=True)

        metadata_dir = Path("data/results/metadata")
        metadata_dir.mkdir(parents=True, exist_ok=True)

        tmp_path = output_dir / f"tmp_{input_path.name}"
        output_path = output_dir / input_path.name
        metadata_path = metadata_dir / f"{input_path.stem}.json"

        cap = cv2.VideoCapture(video_path)

        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        fps = cap.get(cv2.CAP_PROP_FPS)

        fourcc = cv2.VideoWriter_fourcc(*"mp4v")
        out = cv2.VideoWriter(str(tmp_path), fourcc, fps, (width, height))

        frame_count = 0
        frames_metadata = []

        while True:
            success, frame = cap.read()
            if not success:
                break

            t0 = time.perf_counter()
            results = model(frame)
            inference_ms = round((time.perf_counter() - t0) * 1000, 2)

            annotated = results[0].plot()
            out.write(annotated)

            # Full assignment-spec metadata schema per frame
            detections = []
            for box in results[0].boxes:
                class_id = int(box.cls[0])
                x1, y1, x2, y2 = [round(float(v), 2) for v in box.xyxy[0].tolist()]
                detections.append({
                    "class_id": class_id,
                    "class_name": model.names[class_id],
                    "confidence": round(float(box.conf[0]), 4),
                    "bbox": {"x1": x1, "y1": y1, "x2": x2, "y2": y2},
                    "mask_present": results[0].masks is not None
                })

            timestamp_ms = round((frame_count / fps) * 1000, 1) if fps > 0 else 0

            frames_metadata.append({
                "frame_index": frame_count,
                "timestamp_ms": timestamp_ms,
                "model": model_name,
                "detections": detections,
                "total_objects": len(detections),
                "inference_time_ms": inference_ms
            })

            frame_count += 1

        cap.release()
        out.release()

        # Re-encode with FFmpeg to H.264 for browser compatibility
        import subprocess
        try:
            subprocess.run([
                "ffmpeg", "-y",
                "-i", str(tmp_path),
                "-vcodec", "libx264",
                "-crf", "23",
                "-preset", "fast",
                "-movflags", "+faststart",
                str(output_path)
            ], check=True, capture_output=True)
            tmp_path.unlink()
        except (subprocess.CalledProcessError, FileNotFoundError):
            tmp_path.rename(output_path)

        # Write metadata JSON
        with open(metadata_path, "w") as f:
            json.dump({
                "filename": input_path.name,
                "model": model_name,
                "fps": fps,
                "width": width,
                "height": height,
                "total_frames": frame_count,
                "frames": frames_metadata
            }, f)

        return {
            "output_path": str(output_path),
            "metadata_path": str(metadata_path),
            "frames_processed": frame_count
        }