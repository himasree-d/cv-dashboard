import cv2

from app.core.model_loader import model


video_path = "data/uploads/516763f6-ba7a-458c-b27f-917371fb0584.mp4"

cap = cv2.VideoCapture(video_path)

while True:

    success, frame = cap.read()

    if not success:
        break

    results = model(frame)

    annotated = results[0].plot()

    cv2.imshow(
        "YOLO Video",
        annotated
    )

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()