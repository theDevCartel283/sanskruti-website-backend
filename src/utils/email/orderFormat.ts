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
  bankDetails,
}: {
  username: string;
  orderId: string;
  date: Date;
  products: {
    image: string | undefined;
    name: string | undefined;
    quantity: number;
    price: number;
    variation: { key: string; value: string }[];
  }[];
  SubTotal: number;
  discount: number;
  TotalAmount: number;
  paymentMethod: string;
  shippingAddress: Address;
  billingAddress: Address;
  bankDetails?: {
    bank_ref_no: string | null;
    payment_mode: string | null;
    card_name: string | null;
    currency: string | null;
    amount: string | null;
  };
}) => {
  const productsHtml = products
    .map(
      (product) =>
        `
        <tr>
          <td style="padding-top: 0;">
              <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;">
                  <tbody>
                      <tr>
                          <td rowspan="${
                            product.variation.length + 4
                          }" style="padding-right: 10px; padding-bottom: 10px;">
                              <img style="height: 80px;" src="${
                                product.image
                              }" alt="${product.name}" />
                          </td>
                          <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                              ${product.name}
                          </td>
                      </tr>
                      <tr>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                              Quantity: ${product.quantity}
                          </td>
                          <td style="width: 130px;"></td>
                      </tr>
                      
                          ${product.variation
                            .map(
                              (varient) =>
                                `
                              <tr>
                                <td style="font-size: 14px; line-height: 18px; color: #757575;">
                                    ${varient.key}: ${varient.value}
                                </td>
                                <td
                                  style="
                                    font-size: 14px;
                                    line-height: 18px;
                                    color: #757575;
                                    text-align: right;
                                  "
                                >
                                </td>
                              </tr>
                              `
                            )
                            .join("")}                   
                      <tr>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                            
                          </td>
                          <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                              <b style="color: #666666;">&#8377;${
                                product.price
                              }</b>
                          </td>
                      </tr>
                  </tbody>
              </table>
          </td>
        </tr>
        `
    )
    .join("");

  return `
  <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
  <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
          <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
          <title>Order Confirmation Email from</title>
          
          <!-- Start Common CSS -->
          <style type="text/css">
              #outlook a {padding:0;}
              body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; font-family: Helvetica, arial, sans-serif;}
              .ExternalClass {width:100%;}
              .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
              .backgroundTable {margin:0; padding:0; width:100% !important; line-height: 100% !important;}
              .main-temp table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family: Helvetica, arial, sans-serif;}
              .main-temp table td {border-collapse: collapse;}
          </style>
          <!-- End Common CSS -->
      </head>
      <body>
          <table width="100%" cellpadding="0" cellspacing="0" border="0" class="backgroundTable main-temp" style="background-color: #d5d5d5;">
              <tbody>
                  <tr>
                      <td>
                          <table width="600" align="center" cellpadding="15" cellspacing="0" border="0" class="devicewidth" style="background-color: #ffffff;">
                              <tbody>
                                  <!-- Start header Section -->
                                  <tr>
                                      <td style="padding-top: 30px;">
                                          <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee; text-align: center;">
                                              <tbody>
                                                  <tr>
                                                    <td style="padding-bottom: 10px">
                                                      <a href="https://sanskrutinx.in/" width="250"
                                                        ><img
                                                          width="250"
                                                          src="https://sanskrutinx.in/assets/sanskruti-logo.png"
                                                          alt="SanskrutiNx"
                                                      /></a>
                                                    </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                          Shop No. 2, 3, 4
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                          Yashoda Vinayak Sankul, Agra Rd, Opposite
                                                          
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                          Suchak Petrol Pump, Kalyan(West), Maharashtra 421301
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                          Phone: 310-807-6672 | Email: info@example.com
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                          <strong>Order Number:</strong> ${orderId}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 25px;">
                                                          <strong>Order Date:</strong> ${dateFormater(
                                                            date
                                                          )}
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <!-- End header Section -->
                                  
                                  <!-- Start address Section -->
                                  <tr>
                                      <td style="padding-top: 0;">
                                          <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb;">
                                              <tbody>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                                          Delivery Adderss
                                                      </td>
                                                      <td style="width: 45%; font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                                          Billing Address
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            shippingAddress.name
                                                          }
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${billingAddress.name}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            shippingAddress.email
                                                          }
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            billingAddress.email
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${shippingAddress.tel}
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${billingAddress.tel}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            shippingAddress.address
                                                          }
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            billingAddress.address
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            shippingAddress.city
                                                          }, ${
    shippingAddress.state
  }, ${shippingAddress.country}
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${
                                                            billingAddress.city
                                                          }, ${
    billingAddress.state
  }, ${billingAddress.country}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${shippingAddress.zip}
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          ${billingAddress.zip}
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <!-- End address Section -->
                                  
                                  <!-- Start product Section -->
                                  ${productsHtml}
                                  <!-- End product Section -->
                                  
                                  <!-- Start calculation Section -->
                                  <tr>
                                      <td style="padding-top: 0;">
                                          <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb; margin-top: -5px;">
                                              <tbody>
                                                  <tr>
                                                      <td rowspan="5" style="width: 55%;"></td>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666;">
                                                          Sub-Total:
                                                      </td>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666; width: 130px; text-align: right;">
                                                      &#8377;${SubTotal}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee;">
                                                          Discount:
                                                      </td>
                                                      <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px; border-bottom: 1px solid #eeeeee; text-align: right;">
                                                      &#8377;${discount}
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;">
                                                          Order Total
                                                      </td>
                                                      <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;">
                                                      &#8377;${TotalAmount}
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <!-- End calculation Section -->
                                  
                                  <!-- Start payment method Section -->
                                  <tr>
                                      <td style="padding: 0 10px;">
                                          <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner">
                                              <tbody>
                                                  <tr>
                                                      <td colspan="2" style="font-size: 16px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                                          Payment Method (${
                                                            paymentMethod ===
                                                            "PayZapp"
                                                              ? "Bank Tranfer"
                                                              : "Cash on Delivery"
                                                          })
                                                      </td>
                                                  </tr>
                                            ${
                                              paymentMethod === "PayZapp"
                                                ? `
                                                  <tr>
                                                      <td style="width: 100%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          Bank Reference Number: ${
                                                            bankDetails?.bank_ref_no
                                                          }
                                                      </td>
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666;">
                                                          Payment mode: ${
                                                            bankDetails?.payment_mode
                                                          }
                                                      </td>
                                                      ${
                                                        bankDetails?.card_name
                                                          ? `
                                                          <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666;">
                                                              Card Name: ${bankDetails?.card_name}
                                                          </td>`
                                                          : ""
                                                      }
                                                  </tr>
                                                  <tr>
                                                      <td style="width: 55%; font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px;">
                                                          Currency: ${
                                                            bankDetails?.currency
                                                          }
                                                      </td>
                                                      <td style="width: 45%; font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 10px;">
                                                          Amount: ${
                                                            bankDetails?.amount
                                                          }
                                                      </td>
                                                  </tr>
                                             `
                                                : ""
                                            }
                                            </tbody>
                                          </table>
                                      </td>
                                  </tr>
                                  <!-- End payment method Section -->

                                  <!-- Regards -->
                                <tr>
                                  <td
                                    style="
                                      padding: 0 10px 20px 0;
                                      width: 55%;
                                      font-size: 14px;
                                      font-weight: bold;
                                      line-height: 18px;
                                      color: #666666;
                                    "
                                  >
                                    <table
                                      width="560"
                                      align="center"
                                      cellpadding="0"
                                      cellspacing="0"
                                      border="0"
                                      class="devicewidthinner"
                                    >
                                      <tr>
                                        <td>
                                          Thank you for shopping with us. We appreciate your
                                          business and look forward to serving you again in the
                                          future.
                                        </td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                                <tr>
                                  <td
                                    style="
                                      padding: 0 10px 50px 0;
                                      width: 55%;
                                      font-size: 14px;
                                      font-weight: bold;
                                      line-height: 18px;
                                      color: #666666;
                                    "
                                  >
                                    <table
                                      width="560"
                                      align="center"
                                      cellpadding="0"
                                      cellspacing="0"
                                      border="0"
                                      class="devicewidthinner"
                                    >
                                      <tr>
                                        <td>Best regards,</td>
                                      </tr>
                                      <tr>
                                        <td>The SanskrutiNx Team</td>
                                      </tr>
                                    </table>
                                  </td>
                                </tr>
                              </tbody>
                          </table>
                      </td>
                  </tr>
              </tbody>
          </table>
      </body>
  </html>
  `;
};
