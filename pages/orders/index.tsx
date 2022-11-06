import React, { useEffect, useState } from "react";
import { Button, PageHeader, Tag } from "antd";
import Table, { ColumnsType } from "antd/lib/table";
import { IOrder } from "../../interfaces/IOrder";
import { useRouter } from "next/router";
import { IServiceResult } from "../../interfaces/IServiceResult";

export default function Orders() {
  const router = useRouter();
  const [data, setData] = useState<IOrder[]>([]);
  useEffect(() => {
    fetch(`${process.env.BACKEND_URL}/orders`)
      .then((res) => res.json())
      .then((data: IServiceResult<IOrder[]>) => {
        setData(data.data);
      });
  }, []);

  const onNewOrder = (): void => {
    router.push("/new-order");
  };

  const columns: ColumnsType<IOrder> = [
    {
      title: "Order",
      dataIndex: "id",
      key: "id",
      width: 150,
    },
    {
      title: "Parts",
      key: "parts",
      dataIndex: "parts",
      render: (_, { parts }) => (
        <>
          {parts.map((part) => {
            return (
              <Tag color="blue" key={part.description}>
                {part.quantity}x {part.description.toUpperCase()} = $
                {part.price.toFixed(2)}
              </Tag>
            );
          })}
        </>
      ),
    },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (_, { total }) => <>${total.toFixed(2)}</>,
    },
  ];

  return (
    <>
      <PageHeader
        style={{
          border: "1px solid rgb(235, 237, 240)",
          padding: "0 0 0 5px !important",
        }}
        title="Orders"
      />
      <Button
        style={{
          marginTop: 10,
          marginBottom: 10,
        }}
        type="primary"
        onClick={onNewOrder}
      >
        New
      </Button>
      <Table columns={columns} pagination={false} dataSource={data} />
    </>
  );
}
