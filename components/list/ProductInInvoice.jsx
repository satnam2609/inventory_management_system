"use client";

import { useState } from "react";

export default function ProductInInvoice({ product, quantity }) {
  const { name, price, _id } = product;

  return (
    <tr className="text-sm">
      <td>{_id}</td>
      <td>{name}</td>
      <td>&#8377;{price}</td>
      <td>{quantity}</td>
    </tr>
  );
}
