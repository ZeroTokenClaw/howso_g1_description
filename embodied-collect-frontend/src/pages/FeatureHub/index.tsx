import { ArrowRightOutlined } from "@ant-design/icons";
import { Button, Empty, Space, Tag, Typography } from "antd";
import { useNavigate } from "react-router-dom";

const { Text, Title } = Typography;

interface Props {
  title: string;
  description: string;
  tags?: string[];
}

const FeatureHubPage = ({ title, description, tags = [] }: Props) => {
  const navigate = useNavigate();

  return (
    <section className="feature-hub">
      <div>
        <Title level={2}>{title}</Title>
        <Text type="secondary">{description}</Text>
      </div>
      <Space wrap>
        {tags.map((tag) => (
          <Tag key={tag} color="blue">
            {tag}
          </Tag>
        ))}
      </Space>
      <Empty description="前端入口已接入，可继续完善业务表单、详情页和接口联调。" />
      <Space>
        <Button type="primary" icon={<ArrowRightOutlined />} onClick={() => navigate("/upload")}>
          去上传数据
        </Button>
        <Button onClick={() => navigate("/data")}>查看数据</Button>
      </Space>
    </section>
  );
};

export default FeatureHubPage;
