import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";

interface Props {
  onUpload: (file: File) => Promise<void>;
}

const FileUpload = ({ onUpload }: Props) => (
  <Upload
    showUploadList={false}
    beforeUpload={async (file) => {
      try {
        await onUpload(file);
        message.success("上传成功");
      } catch {
        message.error("上传失败");
      }
      return false;
    }}
  >
    <Button icon={<UploadOutlined />}>上传文件</Button>
  </Upload>
);

export default FileUpload;
