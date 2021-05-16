import { Row, Col, Typography, Divider, Alert } from "antd";



const { Title, Text } = Typography;


export const CompleteStep = () => {
  return (
    <Col xs={24}>
      <>
        <Row gutter={[4, 4]} justify="center" align="middle">
          <Title level={4}>Congrats, y're a WIZRD™!</Title>
          <Divider />
          <Alert type="success" message="Registration, successful." />
        </Row>
      </>
    </Col>
  );
};
