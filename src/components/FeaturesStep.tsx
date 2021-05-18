import { Suspense } from "react";
import { Row, Form, Col, Typography, Skeleton, Space, Checkbox, Divider } from "antd";

import { WizardEventArgs } from "../hooks/useWizard";
import { useWizardFeaturesContext, WizardFeaturesContext } from "../hooks/featuresProvider";

import { Feature } from "../types/wizardWizardTypes";

const { Text, Title } = Typography;

export const FeaturesStep = (props: Omit<WizardEventArgs, "fn" | "formValues">) => {
  const { state } = props;
  const { featureList } = useWizardFeaturesContext() as WizardFeaturesContext;

  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Title level={4} style={{ wordBreak: "break-all" }}>
          Hey {state.name} {(state.name as string).length > 30 ? "...long name, huhh?" : null} ✨
        </Title>
        <Text>Please let us know which of WIZRD™'s magical features you're interested in learning below.</Text>
      </Row>
      <Divider />
      <Row gutter={[16, 4]}>
        <Suspense
          fallback={
            <Space>
              <Skeleton.Button active size="large" shape="round" />
              <Skeleton.Button active size="large" shape="round" />
            </Space>
          }
        >
          <Form.Item name="features" label={<Title level={5}>Features</Title>} initialValue={[]}>
            <Checkbox.Group>
              <Row gutter={[24, 16]}>
                {featureList.map((feature: Feature, index: number) => (
                  <Col span={12}>
                    <Checkbox value={feature.id} name="features" key={feature.id}>
                      <Row>{feature.name}</Row>
                      <Row>
                        <Text type="secondary">{feature.description}</Text>
                      </Row>
                    </Checkbox>
                  </Col>
                ))}
              </Row>
            </Checkbox.Group>
          </Form.Item>
        </Suspense>
      </Row>
    </Col>
  );
};
