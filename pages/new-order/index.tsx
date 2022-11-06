import {
  Button,
  Col,
  InputNumber,
  List,
  PageHeader,
  Row,
  Typography,
} from "antd";
import React, { useState, useEffect } from "react";
import { IOrder } from "../../interfaces/IOrder";
import { IPart } from "../../interfaces/IPart";
import { useRouter } from "next/router";
import { IServiceResult } from "../../interfaces/IServiceResult";
import notification, { NotificationPlacement } from "antd/lib/notification";
const { Text } = Typography;

export default function NewOrder() {
  const router = useRouter();
  const [parts, setParts] = useState<IPart[]>([]);

  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/parts`)
      .then((res) => res.json())
      .then((data: IServiceResult<IPart[]>) => {
        setParts(data.data);
      });
  }, []);

  useEffect(() => {
    setInitialOrder();
  }, [parts]);

  const setInitialOrder = (): void => {
    setOrderData(getInitialOrder());
  };

  const getInitialOrder = (): IOrder => {
    return {
      parts: parts.map((p) => {
        return { ...p, quantity: 0, total: 0 };
      }),
      total: 0,
    } as IOrder;
  };

  const [orderData, setOrderData] = useState<IOrder>(getInitialOrder());

  const onQuantityChange = (part: IPart, quantity: number | null): void => {
    const indexItem = orderData.parts.findIndex((x) => x.id == part.id);

    const totalItem = part.price * (quantity || 0);

    const parts = [
      ...orderData.parts.slice(0, indexItem),
      { ...part, quantity: quantity, total: totalItem },
      ...orderData.parts.slice(indexItem + 1),
    ] as IPart[];

    const totalOrder = parts.reduce((acc, { total }) => acc + (total || 0), 0);

    setOrderData({
      ...orderData,
      parts: parts,
      total: totalOrder,
    });
  };

  const onCancel = (): void => {
    router.push("/orders");
  };

  const openErrorNotification = (description: string) => {
    notification.error({
      message: `Error`,
      description: `Oops, there was a problem creating your order. ${description}`,
    });
  };

  const openAlertNotification = (description: string) => {
    notification.warning({
      message: `Alert`,
      description: `${description}`,
    });
  };

  const onConfirm = (): void => {
    const selectedQuantity = orderData.parts.filter(
      (p) => p.quantity > 0
    ).length;
    if (selectedQuantity == 0) {
      openAlertNotification("You need to select quantity");
      return;
    }

    const orderParts = orderData.parts.filter((p) => {
      return p.quantity > 0;
    });

    const orderBody = {
      ...orderData,
      parts: orderParts,
    } as IOrder;

    fetch(`${process.env.BACKEND_URL}/orders`, {
      method: "POST",
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderBody),
    })
      .then((res) => res.json())
      .then((data: IServiceResult<IOrder>) => {
        if (data.isSuccess) {
          router.push("/orders");
        } else {
          openErrorNotification(data.errors.map((x) => x.message).join(". "));
        }
      });
  };

  return (
    <>
      <PageHeader
        style={{
          border: "1px solid rgb(235, 237, 240)",
          padding: "0 0 0 5px !important",
        }}
        title="New Order"
      />
      <List
        header={<div>Select quantities</div>}
        footer={
          <Row justify="end">
            <Col span={4}>
              <Text type="success">Total: ${orderData?.total.toFixed(2)}</Text>
            </Col>
          </Row>
        }
        bordered
        dataSource={orderData?.parts}
        renderItem={(item) => (
          <List.Item>
            <List.Item.Meta
              title={item.description}
              description={
                <>
                  <Row>Price: ${item.price}</Row>
                  <Row>
                    <InputNumber
                      defaultValue={item.quantity}
                      min={0}
                      onChange={(value) => {
                        onQuantityChange(item, value);
                      }}
                    />
                  </Row>
                  <Row>
                    <Typography>Total: ${item.total?.toFixed(2)}</Typography>
                  </Row>
                </>
              }
            />
          </List.Item>
        )}
      />
      <Row
        justify="end"
        style={{
          marginTop: 10,
        }}
      >
        <Col
          style={{
            marginRight: 10,
          }}
        >
          <Button onClick={onCancel}>Cancel</Button>
        </Col>
        <Col>
          <Button type="primary" onClick={onConfirm}>
            Confirm
          </Button>
        </Col>
      </Row>
    </>
  );
}
