import { useState, Suspense, useEffect } from "react";
import { Row, Form, Col, Typography, Skeleton, Space, Checkbox, Divider } from "antd";

import { useWizardContext } from "../hooks/WizardProvider";

const { Text, Title } = Typography;

type Feature = {
  id: number;
  name: string;
  description: string;
};

export const FeaturesStep = (props: any) => {
  const {
    wizardState: [state],
  } = useWizardContext();
  const [featureList, setFeatureList] = useState<Feature[]>(() => []);

  const getFeatures = async () => {
    let res: Response;
    try {
      res = await fetch(`http://127.0.0.1:3001/features`, {
        method: "GET",
      });
    } catch (e) {
      throw new Error(`Failed to fetch magical features data. Try again?`);
    }
    if (res.ok) {
      const data = await res.json();
      console.log(res, { data });
      setFeatureList(data);
    }
  };

  useEffect(() => {
    getFeatures();
  }, []);

  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Title level={4}>
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
