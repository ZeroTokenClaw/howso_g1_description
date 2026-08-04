export interface CollectionTaskItem {
  id: string;
  name: string;
  task_type: string;
  status: string;
  duration_sec: number;
  data_size_mb: number;
  created_at: string;
}

export interface AnnotationTaskItem {
  id: string;
  name: string;
  annotation_type: string;
  progress: number;
  status: string;
  deadline?: string;
}
