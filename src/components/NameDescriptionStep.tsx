import { Input, Row, Form, Col, Typography, Divider } from "antd";

const { Text, Title } = Typography;
const { TextArea } = Input;

export const NameDescriptionStep = (props?: any) => {
  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Text>
          We're glad you're choosing to register with WIZRD™. We're a disruptive witch and wizard registration service
          currently catering to 2 wizards!
        </Text>
      </Row>
      <Divider />
      <Row gutter={[16, 4]}>
        <Col span={24}>
          <Form.Item
            name="name"
            label={<Title level={5}>Name</Title>}
            rules={[
              {
                required: true,
                message: "Please input your name! 🧙",
              },
            ]}
          >
            {/* NOTE: feasibly someone could just send a name longer than 63 directly to the backend */}
            <Input placeholder="Enter your wizard name" maxLength={63} />
          </Form.Item>
        </Col>
        <Col span={24}>
          <Form.Item name="description" label={<Title level={5}>Description</Title>}>
            <TextArea
              autoSize={{ minRows: 3, maxRows: 7 }}
              placeholder="What wily wizardly antics have you been up to?"
              allowClear
            />
          </Form.Item>
        </Col>
      </Row>
    </Col>
  );
};
