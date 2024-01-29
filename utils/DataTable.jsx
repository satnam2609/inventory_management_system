"use client";

import { ConfigProvider, Table } from "antd";

export default function DataTable({
  page,
  rowSelection,
  columns,
  data,
  loading,
  handleTableChange,
  total,
}) {
  return (
    <div>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              headerBg: "#99f8da",
            },
          },
        }}
      >
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          loading={loading}
          pagination={{
            ...page,
            total: total,
          }}
          onChange={handleTableChange}
        />
      </ConfigProvider>
    </div>
  );
}
