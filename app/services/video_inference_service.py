from pathlib import Path
import cv2

from app.core.model_loader import get_model


class VideoInferenceService:

    @staticmethod
    def run_video_inference(
        video_path: str,
        model_name: str
    ):

        model = get_model(model_name)

        output_dir = Path(
            "data/results/videos"
        )

        output_dir.mkdir(
            parents=True,
            exist_ok=True
        )

        input_path = Path(video_path)

        output_path = (
            output_dir /
            input_path.name
        )

        cap = cv2.VideoCapture(
            video_path
        )

        width = int(
            cap.get(
                cv2.CAP_PROP_FRAME_WIDTH
            )
        )

        height = int(
            cap.get(
                cv2.CAP_PROP_FRAME_HEIGHT
            )
        )

        fps = cap.get(
            cv2.CAP_PROP_FPS
        )

        fourcc = cv2.VideoWriter_fourcc(
            *"mp4v"
        )

        out = cv2.VideoWriter(
            str(output_path),
            fourcc,
            fps,
            (width, height)
        )

        frame_count = 0

        while True:

            success, frame = cap.read()

            if not success:
                break

            results = model(frame)

            annotated = (
                results[0]
                .plot()
            )

            out.write(
                annotated
            )

            frame_count += 1

        cap.release()
        out.release()

        return {
            "output_path": str(
                output_path
            ),
            "frames_processed":
                frame_count
        }