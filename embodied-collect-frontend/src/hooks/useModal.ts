import { useState } from "react";

export const useModal = <T = unknown>() => {
  const [open, setOpen] = useState(false);
  const [record, setRecord] = useState<T | null>(null);

  const showCreate = () => {
    setRecord(null);
    setOpen(true);
  };

  const showEdit = (value: T) => {
    setRecord(value);
    setOpen(true);
  };

  const close = () => setOpen(false);

  return { open, record, showCreate, showEdit, close };
};
