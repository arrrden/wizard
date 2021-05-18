import { useReducer, useState } from "react";
import { Button, Card, Typography, Row, Progress, Col, Space, Alert, Form } from "antd";

import { useWizard, WizardStep } from "../hooks/useWizard";

const { Title, Text } = Typography;

interface WizardProps {
  readonly children?: never;
  readonly steps: WizardStep[];
  readonly displayNextStep?: boolean;
}

export type WizardReducerAction<T> = {
  type: T;
  payload?: { [key: string]: unknown };
  event?: () => void;
};

export enum WizardReducerActionType {
  UPDATE,
  SUBMITTING,
  SUCCESS,
  FAILED,
}

export const Wizard = (props: WizardProps) => {
  const { steps, displayNextStep = false } = props;

  const [isSubmitting, setIsSubmitting] = useState<boolean>(() => false);
  const [errorText, setErrorText] = useState<string | null>(() => null);

  const WizardReducer = <T extends unknown>(
    state: Record<string, T>,
    action: WizardReducerAction<WizardReducerActionType>
  ) => {
    const { payload } = action;

    switch (action.type) {
      // NOTE: this only handles updating the entire state but could easily extend to handle
      // patching or validating state at this level
      case WizardReducerActionType.UPDATE:
        return {
          ...payload,
        };
      case WizardReducerActionType.SUBMITTING:
        setIsSubmitting(true);
        return state;
      case WizardReducerActionType.SUCCESS:
        if (action.event) action.event();
        setIsSubmitting(false);
        return state;
      case WizardReducerActionType.FAILED:
        if (action.event) action.event();
        setIsSubmitting(false);
        return state;
      default:
        throw new Error(`Unhandled action '${action.type}'`);
    }
  };

  const [form] = Form.useForm();
  const { navigation, step: Step, stepIndex, nextStep, progress } = useWizard(steps);
  const [state, dispatch] = useReducer(WizardReducer, {}, () => ({}));

  const updateState = (input: object) => {
    try {
      dispatch({
        type: WizardReducerActionType.UPDATE,
        payload: {
          ...state,
          ...input,
        },
      });
    } catch (e) {
      throw new Error(`Oops there was a very unmagical error`);
    }
  };

  const handleComplete = async (values: any) => {
    // NOTE: This maybe could be tidier
    try {
      if (Step.stepType === "submission" && Step.onSubmit) {
        dispatch({
          type: WizardReducerActionType.SUBMITTING,
          event: () => setErrorText(null),
        });

        const res = await Step.onSubmit({ state, navigation });

        if (res === "ok") {
          dispatch({
            type: WizardReducerActionType.SUCCESS,
            event: () => navigation.next(),
          });
        }
      } else if (Step.onExit) {
        setErrorText(null);
        const res = await Step.onExit({ formValues: values, state, navigation, fn: { updateState } });
        if (res === "ok") navigation.next();
      }
    } catch (e) {
      dispatch({
        type: WizardReducerActionType.FAILED,
        event: () => setErrorText(`Oops, that's not magic, ${e}`),
      });
    }
  };

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
          boxShadow: "0 0 10px 0 #aaaaaa",
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
          {/* eslint-disable-next-line react/jsx-pascal-case */}
          <Step.body state={state} navigation={navigation} />
          <Row justify="end" gutter={[16, 16]}>
            {Step.stepType === "submission" ? (
              <>
                <Col>
                  <Button htmlType="submit" loading={isSubmitting} icon={<>🪄</>}>
                    <Text style={{ marginLeft: "0.4rem" }}>Submit</Text>
                  </Button>
                </Col>
              </>
            ) : Step.stepType === "final" ? null : (
              <>
                {stepIndex !== 0 ? (
                  <Col>
                    <Button onClick={() => navigation.previous()}>Back</Button>
                  </Col>
                ) : null}
                <Col>
                  <Row>
                    <Button htmlType="submit" loading={isSubmitting} data-testid="next">
                      Next
                    </Button>
                  </Row>
                </Col>
              </>
            )}
          </Row>
          <Row justify="end">
            {nextStep && displayNextStep ? (
              <Space wrap>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "0.66rem",
                    maxWidth: "2ch",
                    whiteSpace: "break-spaces",
                  }}
                >
                  Next: {nextStep?.heading}
                </Text>
              </Space>
            ) : null}
          </Row>
        </Form>
      </Card>
    </>
  );
};
