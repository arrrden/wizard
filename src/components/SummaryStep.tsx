import { useState, useEffect } from "react";
import { Row, Col, Typography, Tag, Card, Button, Checkbox, Popover, Space, Empty, Divider, Alert } from "antd";

import { useWizardContext } from "../hooks/WizardProvider";

const { Title, Text } = Typography;

type Feature = {
  id: number;
  name: string;
  description: string;
};

export const SummaryStep = () => {
  const {
    wizardNavigation: [navigate],
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
      setFeatureList(data);
    }
  };

  useEffect(() => {
    getFeatures();
  }, []);

  return (
    <Col xs={24}>
      <Row gutter={[16, 16]}>
        <Title level={4}>Great, you're *nearly* done.</Title>
      </Row>
      <Row gutter={[16, 16]}>
        <Text>Review your data and submit when you're ready!</Text>
      </Row>
      <Divider />

      <Row gutter={[16, 16]}>
        <Card
          type="inner"
          title="Name & Description"
          extra={<Button onClick={() => navigate.jumpTo("initial")}>Edit</Button>}
          style={{ width: "100%", margin: "12px 0", borderRadius: "8px" }}
        >
          <Row gutter={[16, 16]}>
            <Col span={24}>
              <Title level={5}>Name:</Title>
              <Text>{state.name as string}</Text>
            </Col>
            {state.description ? (
              <Col span={24}>
                <Title level={5}>Description:</Title>
                <Text>{state.description as string}</Text>
              </Col>
            ) : null}
          </Row>
        </Card>
        <Card
          type="inner"
          title="Wizard powers"
          extra={<Button onClick={() => navigate.jumpTo("features")}>Edit</Button>}
          style={{ width: "100%", margin: "12px 0", borderRadius: "8px" }}
        >
          <Checkbox.Group>
            <Row gutter={[24, 24]}>
              {Array.isArray(state.features) && state.features.length > 0 ? (
                <Space>
                  {featureList
                    .filter((feature: Feature) => (state.features as number[]).includes(feature.id))
                    .map((feature: Feature, index: number) => {
                      const content = <Text type="secondary">{feature.description}</Text>;

                      // NOTE: largely just taking the opportunity to be a little silly.
                      const wizArray = ["🪄", "🧚🏻", "🧞", "🧙‍♂️", "🧪", "🧙🏻‍♀️", "🧙🏿", "🧙🏽‍♂️", "✨"];
                      const wizColorArray = [
                        "magenta",
                        "red",
                        "volcano",
                        "orange",
                        "gold",
                        "lime",
                        "green",
                        "cyan",
                        "blue",
                        "greekblue",
                        "purple",
                      ];

                      return (
                        <Popover placement="topLeft" content={content} title={`${feature.name} description`}>
                          <Tag
                            color={wizColorArray[Math.round(Math.random() * (wizColorArray.length - 1))]}
                            icon={<>{wizArray[Math.round(Math.random() * (wizArray.length - 1))]}</>}
                            style={{ padding: "8px", borderRadius: "12px" }}
                            key={feature.id}
                          >
                            {feature.name}
                          </Tag>
                        </Popover>
                      );
                    })}
                </Space>
              ) : (
                  <Row justify="center" align="middle">
                <Col span={12}>
                  <Row justify="center" align="middle">
                    <Empty />
                  </Row>
                </Col>
                  </Row>
              )}
            </Row>
          </Checkbox.Group>
        </Card>
      </Row>
    </Col>
  );
};
