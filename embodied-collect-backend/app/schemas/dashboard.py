from pydantic import BaseModel


class DashboardOverview(BaseModel):
    data_stats: dict
    task_stats: dict
    device_stats: dict
    robot_stats: dict
    storage_stats: dict
