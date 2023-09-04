import { dateFormater } from "../dateFormater";
import { Address } from "../../model/user.model";

export const getOrderFormat = ({
  username,
  orderId,
  date,
  products,
  SubTotal,
  discount,
  TotalAmount,
  paymentMethod,
  shippingAddress,
  billingAddress,
}: {
  username: string;

  orderId: string;
  date: Date;
  products: {
    image: string | undefined;
    name: string | undefined;
    quantity: number;
    price: number;
    variation: string[];
  }[];
  SubTotal: number;
  discount: number;
  TotalAmount: number;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
}) => {
  const productsHtml = products
    .map(
      (product) =>
        `<tr style="border-bottom: 1px solid #fb7185;">
          <td style="width: 100%; padding: 10px; display: flex; justify-content: center; align-items: center;">
            <img
              src="${product.image}"
              style="width: 100%;"
              alt="${product.name}"
            />
          </td>
          <td style="padding: 10px; width: 100%; overflow-wrap: break-word; text-align: center; align-items: center; justify-content: center;">
            <span>${product.name}</span>
            <p>${product.variation.join(", ")}</p>
            <p>Quantity: ${product.quantity}</p>           
          </td>
          <td style="padding: 10px; width: 100%; align-items: center;">&#8377;${
            product.price
          }</td>
        </tr>`
    )
    .join("");

  return `
  <!DOCTYPE html>
<html>
  <head>
    <title>Order Confirmation</title>
    <style>
      @import url("https://fonts.googleapis.com/css2?family=Open+Sans:wght@300&display=swap");
      body {
        background-color: #f8fafc;
        font-family: "Open Sans", sans-serif;
        color: black;
        padding: 10px;
      }

      .container {
        background-color: #f1f5f9;
        padding: 1rem;
        border-radius: 1rem;
      }

      .image {
        max-width: 30rem;
        border-radius: 10px;
        margin: auto;
      }

      .thankyoubox {
        background-image: linear-gradient(
          to top right,
          #5eead4,
          #99f6e4,
          #ccfbf1
        );
        border-radius: 0.5rem;
        padding: 1rem;
        text-align: center;
      }

      .thankyoubox > * {
        margin: 10px auto;
      }

      .orderId {
        padding: 0.7rem 1.5rem;
        width: fit-content;
        border-radius: 1.5rem;
        background-color: #fb7185;
        font-weight: 600;
        color: black;
      }

      table,
      th,
      td {
        width: 100%;
        border-collapse: collapse;
        padding: 10px 0px;
      }

      th {
        border-top: 1px solid #fb7185;
        border-bottom: 1px solid #fb7185;
      }
    </style>
  </head>
  <body style="max-width: 30rem; margin: auto">
    <div class="container">
      <div class="thankyoubox">
        <h1 style="margin: 0">Thanks For Your Order</h1>
        <p style="margin: 0">on ${dateFormater(date)}</p>
        <p>
          Thank you for your recent order. We are pleased to confirm that we
          have received your order and it is currently being processed.
        </p>
        <div class="orderId">Order id: ${orderId}</div>
        <p>
      </div>
      <h2 style="text-align: center">Order Details</h2>
      <table>
        <thead>
          <tr>
            <th style="width: 33%;">Item</th>
            <th style="width: 33%;">Info</th>
            <th style="width: 33%;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${productsHtml}
        </tbody>
      </table>

      <h2 style="text-align: center">Payment Summary</h2>
      <table>
        <tr>
          <td>SubTotal</td>
          <td>&#8377;${SubTotal}</td>
        </tr>
        <tr>
          <td>Discount</td>
          <td>&#8377;${discount}</td>
        </tr>
        <tr>
          <td>Total</td>
          <td>&#8377;${TotalAmount}</td>
        </tr>
      </table>

      <h2 style="text-align: center">Payment Method</h2>
      <p style="text-align: center">${paymentMethod}</p>

      <h2 style="text-align: center">Shipping Address:</h2>
      <p style="text-align: center">${shippingAddress.name}</p>
      <p style="text-align: center">${shippingAddress.email} • +${
    shippingAddress.tel
  }</p>
      <p style="text-align: center">${shippingAddress.address}, ${
    shippingAddress.city
  }, ${shippingAddress.state}, ${shippingAddress.country} ${
    shippingAddress.zip
  }</p>


      <h2 style="text-align: center">Billing Address:</h2>
      <p style="text-align: center">${billingAddress.name}</p>
      <p style="text-align: center">${billingAddress.email} • +${
    billingAddress.tel
  }</p>
      <p style="text-align: center">${billingAddress.address}, ${
    billingAddress.city
  }, ${billingAddress.state}, ${billingAddress.country} ${
    billingAddress.zip
  }</p>
      
      <br />
      <br />
      <p>
        Please note that this email serves as a confirmation of your order. Once your order is shipped, you will receive a separate email with the
        tracking information.
      </p>
      <p>
        Thank you for shopping with us. We appreciate your business and look forward to serving you again in the future.
      </p>
      <p>Best regards,<br />The SanskrutiNx Team</p>
    </div>
  </body>
</html>

  `;
};
