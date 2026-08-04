import { Modal, Form, Input } from "antd";
import { useEffect } from "react";

interface ProModalProps<T extends Record<string, unknown>> {
  open: boolean;
  title: string;
  initialValues?: T | null;
  fields: { name: string; label: string; required?: boolean }[];
  onCancel: () => void;
  onSubmit: (values: T) => Promise<void> | void;
}

const ProModal = <T extends Record<string, unknown>>({
  open,
  title,
  initialValues,
  fields,
  onCancel,
  onSubmit,
}: ProModalProps<T>) => {
  const [form] = Form.useForm<T>();

  useEffect(() => {
    form.setFieldsValue((initialValues ?? {}) as never);
  }, [form, initialValues]);

  return (
    <Modal
      title={title}
      open={open}
      onCancel={onCancel}
      onOk={async () => {
        const values = await form.validateFields();
        await onSubmit(values);
      }}
      destroyOnClose
    >
      <Form form={form} layout="vertical">
        {fields.map((f) => (
          <Form.Item key={f.name} name={f.name} label={f.label} rules={[{ required: !!f.required, message: `请输入${f.label}` }]}>
            <Input />
          </Form.Item>
        ))}
      </Form>
    </Modal>
  );
};

export default ProModal;
