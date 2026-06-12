from celery import Celery

celery = Celery(
    "cv_dashboard",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/0",
    include=[
        "app.tasks.image_tasks",
        "app.tasks.video_tasks"
    ]
)

celery.conf.update(
    task_track_started=True
)