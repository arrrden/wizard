import { useEffect, useState } from "react";
import { Button, Card, Typography, Row, Progress, Col, Space, Alert, Form } from "antd";

import { useWizard, WizardStep } from "../hooks/useWizard";

const { Title, Text } = Typography;

interface WizardProps {
  readonly children?: never;
  readonly steps: WizardStep[];
}

export const Wizard = (props: WizardProps) => {
  const { steps } = props;

  const [form] = Form.useForm();

  const { navigation, step: Step, nextStep, progress } = useWizard(steps);

  const [errorText, setErrorText] = useState<string | null>(() => null);

  const handleComplete = async (values: any) => {
    // NOTE: This could be tidier
    if (Step.onExit) {
      try {
        setErrorText(null)
        const res = await Step.onExit(values);
        if (res === 'ok') navigation.next();
      } catch (e) {
        setErrorText(`${e}`);
      }
    }
  };

  useEffect(() => {
    console.log({form})
  }, [form])

  return (
    <>
      <Card
        data-test-id="wizard"
        title={
          <>
            <Title level={2}>{Step.heading}</Title>
            <Progress percent={progress} showInfo={false} status="active" />
          </>
        }
        style={{
          width: "min(600px, 100%)",
          borderRadius: "8px",
          border: "2px solid #ef7796",
          boxShadow: "0 0 10px 0 #ef7796",
        }}
        bodyStyle={{
          height: "100%",
        }}
      >
        {errorText ? (
          <Alert message={errorText} type="error" showIcon closable onClose={() => setErrorText(null)} />
        ) : null}
        <Form
          layout="vertical"
          form={form}
          style={{ width: "100%", margin: "8px 0" }}
          onFinish={async (values) => await handleComplete(values)}
        >
          <Step.body  />
          <Row justify="end" gutter={[16, 16]}>
            <Col>
              <Button onClick={() => navigation.previous()}>Back</Button>
            </Col>
            <Col>
              <Row>
                <Button htmlType="submit">Next</Button>
              </Row>
              {nextStep ? (
                <Space wrap>
                  <Text
                    type="secondary"
                    style={{
                      fontSize: "0.66rem",
                      maxWidth: "2ch",
                      whiteSpace: "break-spaces",
                    }}
                  >
                    {nextStep?.heading}
                  </Text>
                </Space>
              ) : null}
            </Col>
          </Row>
        </Form>
      </Card>
    </>
  );
};
