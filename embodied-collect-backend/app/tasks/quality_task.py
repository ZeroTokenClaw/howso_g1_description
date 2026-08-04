from app.tasks.celery_app import celery_app


@celery_app.task(name="quality_check_task")
def quality_check_task(job_id: str) -> dict:
    return {"job_id": job_id, "status": "completed"}
