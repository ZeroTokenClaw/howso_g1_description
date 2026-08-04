from app.tasks.celery_app import celery_app


@celery_app.task(name="import_data_task")
def import_data_task(job_id: str) -> dict:
    return {"job_id": job_id, "status": "completed"}
