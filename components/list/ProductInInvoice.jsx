"use client";

import { useState } from "react";

export default function ProductInInvoice({ product, quantity, type }) {
  const { name, _id, cost, price } = product;

  return (
    <tr className="text-sm">
      <td>{_id}</td>
      <td>{name}</td>
      <td>&#8377;{type ? cost : price}</td>
      <td>{quantity}</td>
    </tr>
  );
}
