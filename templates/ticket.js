const moment = require("moment/moment");


const formatTime = (dateString) =>  moment(dateString).format("HH:mm:ss DD/MM/YYYY")
const formatCurrency = (amount, locale = 'vi-VN', currency = 'VND') => {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency
    }).format(amount);
}
function generateEmailHtml(ticket,qrCode) {
  const soGhe = 85;
  const soGheMoiHang = 10;
  const soHang = Math.ceil(soGhe / soGheMoiHang);
  const convertToTenGhe = (hang, ghe) => {
    return `${String.fromCharCode(65 + hang)}${ghe + 1}`;
  };
  const showGhe = (ticket) =>
    ticket?.map((gheIndex) =>
      convertToTenGhe(
        Math.floor((gheIndex - 1) / soGheMoiHang),
        (gheIndex - 1) % soGheMoiHang
      )
    );

  const hasExtras = ticket.extras && ticket.extras.length > 0;
  const extrasHtml = hasExtras
    ? ticket.extras
        .map(
          (extra) => ` <td
    style="
      font-weight: bold;
      color: #303233;
    "
  >
   ${extra.quantity} x ${extra.itemId.name}
  </td>`
        )
        .join(", ")
    : "Không có";
  return `
      <body>
    <div>
      <table width="100%" border="0" cellspacing="0" cellpadding="0">
        <tbody>
          <tr>
            <td
              align="center"
              style="min-width: 512px; background-color: #f3f3f3"
            >
              <table
                width="100%"
                border="0"
                align="center"
                cellpadding="0"
                cellspacing="0"
              >
                <tbody>
                  <tr>
                    <td align="center" style="padding-bottom: 0px">
                      <table
                        align="center"
                        width="512"
                        border="0"
                        cellspacing="0"
                        cellpadding="0"
                      >
                        <tbody>
                          <tr>
                            <td
                              align="center"
                              style="padding-top: 10px; padding-bottom: 15px"
                            >
                              <table
                                width="95%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr></tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="100%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      style="
                                        border-top: 3px solid #ae2070;
                                        border-radius: 4px 4px 0 0;
                                      "
                                    ></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td
                              align="center"
                              style="
                                padding-top: 25px;
                                padding-bottom: 25px;
                                background-color: white;
                              "
                            >
                              <a
                                href="https://cinema429.vercel.app/"
                                target="_blank"
                                data-saferedirecturl="https://www.google.com/url?q=https://www.momo.vn/&amp;source=gmail&amp;ust=1724757323412000&amp;usg=AOvVaw0u6lH6WgNj654XKjXXbQPY"
                                ><img
                                  src="https://cinema429.vercel.app/_next/image?url=%2Fimage%2Flogo%2F1.png&w=128&q=75"
                                  width="42"
                                  height="42"
                                  alt="Cinema 429"
                                  style="
                                    display: block;
                                    border: 0;
                                    font-size: 20px;
                                    font-weight: bold;
                                  "
                                  class="CToWUd"
                                  data-bit="iit"
                                  jslog="138226; u014N:xr6bB; 53:WzAsMl0."
                              /></a>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="90%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td>
                                      <img
                                        src="https://ci3.googleusercontent.com/meips/ADKq_Nb4_CdH6ivMV5KKC_7dZJeRIFgPMT36aYr6lv1KtFbbaYbkwwboMuqe4EtJr0sKtSO5FxCjpxamr-DPYaXx2jcj5jqq_Ao5gPpCNz1ur7UInVOcaKE=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/banner_cinema.png"
                                        width="100%"
                                        alt="Ví điện tử MoMo"
                                        style="
                                          object-fit: contain;
                                          display: block;
                                          border: 0;
                                        "
                                        class="CToWUd a6T"
                                        data-bit="iit"
                                        tabindex="0"
                                      />
                                      <div
                                        class="a6S"
                                        dir="ltr"
                                        style="
                                          opacity: 0.01;
                                          left: 841.582px;
                                          top: 265.699px;
                                        "
                                      >
                                        <span
                                          data-is-tooltip-wrapper="true"
                                          class="a5q"
                                          jsaction="JIbuQc:.CLIENT"
                                          ><button
                                            class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE"
                                            jscontroller="PIVayb"
                                            jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;"
                                            data-idom-class="CgzRE"
                                            jsname="hRZeKc"
                                            aria-label="Tải xuống tệp đính kèm "
                                            data-tooltip-enabled="true"
                                            data-tooltip-id="tt-c18"
                                            data-tooltip-classes="AZPksf"
                                            id=""
                                            jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc5MDc1NjQwMTE4ODA5NjE2NCJd; 43:WyJpbWFnZS9qcGVnIl0."
                                          >
                                            <span
                                              class="OiePBf-zPjgPe VYBDae-JX-UHGRz"
                                            ></span
                                            ><span
                                              class="bHC-Q"
                                              data-unbounded="false"
                                              jscontroller="LBaJxb"
                                              jsname="m9ZlFb"
                                              soy-skip=""
                                              ssk="6:RWVI5c"
                                            ></span
                                            ><span
                                              class="VYBDae-JX-ank-Rtc0Jf"
                                              jsname="S5tZuc"
                                              aria-hidden="true"
                                              ><span
                                                class="bzc-ank"
                                                aria-hidden="true"
                                                ><svg
                                                  viewBox="0 -960 960 960"
                                                  height="20"
                                                  width="20"
                                                  focusable="false"
                                                  class="aoH"
                                                >
                                                  <path
                                                    d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"
                                                  ></path></svg></span
                                            ></span>
                                            <div class="VYBDae-JX-ano"></div>
                                          </button>
                                          <div
                                            class="ne2Ple-oshW8e-J9"
                                            id="tt-c18"
                                            role="tooltip"
                                            aria-hidden="true"
                                          >
                                            Tải xuống
                                          </div></span
                                        >
                                      </div>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="90%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      align="left"
                                      style="
                                        padding-top: 25px;
                                        padding-bottom: 25px;
                                        background-color: white;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0 0 0 0;
                                          color: #303233;
                                          font-size: 12px;
                                          margin: 0;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        Xin chào
                                        <span
                                          style="
                                            color: #303233;
                                            font-size: 12px;
                                            font-weight: bold;
                                          "
                                          >${ticket.email},</span
                                        >
                                      </p>
                                      <p
                                        style="
                                          margin: 0 0 0 0;
                                          color: #303233;
                                          font-size: 12px;
                                        "
                                      >
                                        <br />
                                        Cảm ơn bạn đã sử dụng dịch vụ của
                                        <span class="il">429 Cinema</span>!<br />
                                        <span class="il">429 Cinema</span> xác nhận
                                        bạn đã đặt vé xem phim của
                                        <span
                                          style="
                                            font-weight: bold;
                                            font-size: 12px;
                                          "
                                          >${
                                            ticket.interest.room.branch.name
                                          }</span
                                        >
                                        thành công lúc
                                        <span
                                          style="
                                            font-weight: bold;
                                            font-size: 12px;
                                          "
                                          >${formatTime(ticket.createdAt)}</span
                                        >
                                        <br />
                                        Chi tiết vé của bạn như sau:
                                      </p>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="90%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-bottom: 12px"
                              >
                                <tbody>
                                  <tr>
                                    <td
                                      align="left"
                                      style="
                                        padding-top: 25px;
                                        padding-bottom: 0px;
                                        background-color: white;
                                        border: 1px solid #e8e8e8;
                                        border-radius: 12px;
                                      "
                                    >
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="
                                                color: #303233;
                                                font-size: 16px;
                                                padding-bottom: 5px;
                                              "
                                            >
                                              <strong>Mã đặt vé</strong>
                                            </td>
                                          </tr>
                                          <tr align="center">
                                            <td
                                              style="
                                                color: #eb2f96;
                                                font-size: 20px;
                                                padding-bottom: 10px;
                                              "
                                            >
                                              <strong>${ticket.uuid}</strong>
                                            </td>
                                          </tr>
                                          <tr align="center">
                                            <td align="center">
                                              <table
                                                border="0"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="margin-bottom: 10px"
                                              >
                                                <tbody>
                                                  <tr align="center">
                                                    <td
                                                      align="center"
                                                      style="
                                                        padding: 2px;
                                                        background-color: white;
                                                        border: 1px solid
                                                          #e8e8e8;
                                                        border-radius: 12px;
                                                      "
                                                    >
                                                      <img
                                                        src="${qrCode}"
                                                        width="280px"
                                                        alt="Ví điện tử MoMo"
                                                        style="
                                                          object-fit: contain;
                                                          display: block;
                                                          border: 0;
                                                        "
                                                        data-image-whitelisted=""
                                                        class="CToWUd"
                                                        data-bit="iit"
                                                      />
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                          <tr align="center">
                                            <td
                                              style="
                                                color: #727272;
                                                font-size: 12px;
                                                padding-bottom: 15px;
                                              "
                                            >
                                              Quét mã này để xem chi tiết vé của bạn
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="
                                                padding-left: 12px;
                                                padding-right: 12px;
                                              "
                                            >
                                              <table
                                                width="100%"
                                                border="0"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                              >
                                                <tbody>
                                                  <tr align="center">
                                                    <td
                                                      style="
                                                        padding: 0px 0px 1px 0px;
                                                      "
                                                      bgcolor="#e8e8e8"
                                                      width="100%"
                                                    ></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="
                                                color: #727272;
                                                font-size: 14px;
                                              "
                                            >
                                              Thời gian chiếu
                                            </td>
                                          </tr>
                                          <tr align="center">
                                            <td
                                              style="
                                                color: #303233;
                                                font-size: 14px;
                                              "
                                            >
                                              <strong
                                                >${
                                                    formatTime(ticket.interest.startTime)
                                                }</strong
                                              >
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                      <table
                                        width="100%"
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="padding: 0px 0px 8px 0px"
                                              bgcolor="#f9f9f9"
                                              width="100%"
                                            ></td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 8px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td>
                                              <table
                                                width="100%"
                                                border="0"
                                                align="left"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="margin-left: 12px"
                                              >
                                                <tbody>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      Phim
                                                    </td>
                                                  </tr>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        font-weight: bold;
                                                        color: #303233;
                                                      "
                                                    >
                                                      ${
                                                        ticket.interest.movie
                                                          .name
                                                      }
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td style="vertical-align: top">
                                              <table
                                                width="150"
                                                border="0"
                                                align="left"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="
                                                  margin-left: 12px;
                                                  margin-right: 12px;
                                                "
                                              >
                                                <tbody>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      Phòng Chiếu
                                                    </td>
                                                  </tr>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #303233;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      ${
                                                        ticket.interest.room
                                                          .name
                                                      }
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                            <td style="vertical-align: top">
                                              <table
                                                width="150"
                                                border="0"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="
                                                  margin-left: 10px;
                                                  margin-right: 10px;
                                                "
                                              >
                                                <tbody>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      Số Vé
                                                    </td>
                                                  </tr>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #303233;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                     ${ticket.seats.length}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                            <td style="vertical-align: top">
                                              <table
                                                width="100%"
                                                border="0"
                                                align="right"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="
                                                  margin-left: 12px;
                                                  margin-right: 12px;
                                                "
                                              >
                                                <tbody>
                                                  <tr
                                                    align="left"
                                                    style="margin-right: 12px"
                                                  >
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      Số Ghế
                                                    </td>
                                                  </tr>
                                                  <tr
                                                    align="left"
                                                    style="margin-right: 12px"
                                                  >
                                                    <td
                                                      style="
                                                        color: #303233;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                    ${showGhe(
                                                      ticket?.seats
                                                    ).join(",")}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="
                                                padding-left: 12px;
                                                padding-right: 12px;
                                              "
                                            >
                                              <table
                                                width="100%"
                                                border="0"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                              >
                                                <tbody>
                                                  <tr align="center">
                                                    <td
                                                      style="
                                                        padding: 0px 0px 1px 0px;
                                                      "
                                                      bgcolor="#e8e8e8"
                                                      width="100%"
                                                    ></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 8px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td>
                                              <table
                                                width="100%"
                                                border="0"
                                                align="left"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="margin-left: 12px"
                                              >
                                                <tbody>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      Thức ăn kèm
                                                    </td>
                                                  </tr>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        font-weight: bold;
                                                        color: #303233;
                                                      "
                                                    >
                                                    ${extrasHtml}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="
                                                padding-left: 12px;
                                                padding-right: 12px;
                                              "
                                            >
                                              <table
                                                width="100%"
                                                border="0"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                              >
                                                <tbody>
                                                  <tr align="center">
                                                    <td
                                                      style="
                                                        padding: 0px 0px 1px 0px;
                                                      "
                                                      bgcolor="#e8e8e8"
                                                      width="100%"
                                                    ></td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="margin-bottom: 8px"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td>
                                              <table
                                                width="100%"
                                                border="0"
                                                align="left"
                                                cellpadding="0"
                                                cellspacing="0"
                                                style="margin-left: 12px"
                                              >
                                                <tbody>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                      Rạp chiếu
                                                    </td>
                                                  </tr>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        font-weight: bold;
                                                        color: #303233;
                                                      "
                                                    >
                                                      ${
                                                        ticket.interest.room
                                                          .branch.name
                                                      }
                                                    </td>
                                                  </tr>
                                                  <tr align="left">
                                                    <td
                                                      style="
                                                        color: #727272;
                                                        font-size: 14px;
                                                      "
                                                    >
                                                   ${
                                            ticket.interest.room.branch.address
                                          }
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>

                                      <table
                                        width="100%"
                                        border="0"
                                        align="center"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="center">
                                            <td
                                              style="
                                                background-color: #f0f0f0;
                                                padding-top: 22px;
                                                padding-bottom: 22px;
                                                border-bottom-left-radius: 12px;
                                                border-bottom-right-radius: 12px;
                                              "
                                            >
                                              <table
                                                width="100%"
                                                border="0"
                                                align="center"
                                                cellpadding="0"
                                                cellspacing="0"
                                              >
                                                <tbody>
                                                  <tr align="center">
                                                    <td
                                                      align="left"
                                                      style="
                                                        color: #303233;
                                                        font-size: 14px;
                                                        padding-left: 12px;
                                                      "
                                                    >
                                                      Tổng tiền
                                                    </td>
                                                    <td
                                                      align="right"
                                                      style="
                                                        color: #303233;
                                                        font-size: 20px;
                                                        font-weight: bold;
                                                        padding-right: 12px;
                                                      "
                                                    >
                                                     ${formatCurrency(ticket.price)}
                                                    </td>
                                                  </tr>
                                                </tbody>
                                              </table>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="90%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr align="left">
                                    <td>
                                      <a
                                        href="https://page.momoapp.vn/vWa3N4pE5po"
                                        style="
                                          margin: 0;
                                          color: #9b9b9b;
                                          font-weight: 400;
                                          line-height: 1.3;
                                          margin: 0;
                                          padding: 0;
                                          text-align: left;
                                        "
                                        target="_blank"
                                        data-saferedirecturl="https://www.google.com/url?q=https://page.momoapp.vn/vWa3N4pE5po&amp;source=gmail&amp;ust=1724757323412000&amp;usg=AOvVaw0FcZ0wXEg68-B5cCIXx8If"
                                      >
                                        <table
                                          border="0"
                                          align="left"
                                          cellpadding="0"
                                          cellspacing="0"
                                        >
                                          <tbody>
                                            <tr align="left">
                                              <td
                                                align="left"
                                                style="
                                                  font-size: 16px;
                                                  color: #d82d8b;
                                                  font-weight: bold;
                                                  padding-right: 5px;
                                                "
                                              >
                                                Quản lý vé
                                              </td>
                                              <td align="left">
                                                <img
                                                  height="24"
                                                  width="24"
                                                  style="
                                                    border: none;
                                                    clear: both;
                                                    display: inline-block;
                                                    height: 24px;
                                                    max-width: 100%;
                                                    outline: 0;
                                                    text-decoration: none;
                                                    vertical-align: middle;
                                                    width: 24px;
                                                  "
                                                  src="https://ci3.googleusercontent.com/meips/ADKq_Nag89YGKKwDDVu6JbH0wzmYzEeo41Eel-JwsJk4FoLOiLNQ-0miOsdtn6tQNI4rCYo7CUT0OHpX65-e271HvhIC0BiazEPsPhcLN5sq5yMdpg=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/next_pink.png"
                                                  title="next"
                                                  class="CToWUd"
                                                  data-bit="iit"
                                                />
                                              </td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </a>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="100%"
                                border="0"
                                align="left"
                                cellpadding="0"
                                cellspacing="0"
                                style="margin-bottom: 12px"
                              >
                                <tbody>
                                  <tr align="center">
                                    <td
                                      style="padding: 0px 0px 8px 0px"
                                      bgcolor="#f9f9f9"
                                      width="100%"
                                    ></td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                          <tr>
                            <td align="center" style="background-color: white">
                              <table
                                width="90%"
                                border="0"
                                align="center"
                                cellpadding="0"
                                cellspacing="0"
                              >
                                <tbody>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="left">
                                            <td
                                              align="left"
                                              style="padding-right: 5px"
                                            >
                                              <img
                                                height="24"
                                                width="24"
                                                style="
                                                  border: none;
                                                  clear: both;
                                                  display: inline-block;
                                                  height: 24px;
                                                  max-width: 100%;
                                                  outline: 0;
                                                  text-decoration: none;
                                                  vertical-align: middle;
                                                  width: 24px;
                                                "
                                                src="https://ci3.googleusercontent.com/meips/ADKq_NbDbI7AFOEGukr9ibA7Bwgv2W9kJatbhSR48PWDXx_cKt5DPlBCkgMtH-vo4gJXBFL7PFBGv1h4ktvxNgtvCOYVtzZka_oJJ5WiC8A=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/file.png"
                                                title="next"
                                                class="CToWUd"
                                                data-bit="iit"
                                              />
                                            </td>
                                            <td
                                              align="left"
                                              style="
                                                font-size: 14px;
                                                color: #303233;
                                                font-weight: bold;
                                                margin-left: 12px;
                                              "
                                            >
                                              Chính sách hoàn/ huỷ
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="padding-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 12px;
                                                color: #303233;
                                              "
                                            >
                                              <span class="il">429 Cinema</span> không
                                              hỗ trợ đổi trả đối với các vé xem
                                              phim đã mua thành công qua ứng
                                              dụng <span class="il">429 Cinema</span>.
                                              Trường hợp giao dịch của bạn đang
                                              chờ xử lý, vui lòng liên hệ với
                                              tổng đài
                                              <span class="il">429 Cinema</span> để
                                              được hỗ trợ kịp thời.
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="left">
                                            <td
                                              align="left"
                                              style="padding-right: 5px"
                                            >
                                              <img
                                                height="24"
                                                width="24"
                                                style="
                                                  border: none;
                                                  clear: both;
                                                  display: inline-block;
                                                  height: 24px;
                                                  max-width: 100%;
                                                  outline: 0;
                                                  text-decoration: none;
                                                  vertical-align: middle;
                                                  width: 24px;
                                                "
                                                src="https://ci3.googleusercontent.com/meips/ADKq_Na8nQbWHNw0GNMKsJimaeA3YYNm2RzEzTPk7T8uHUtrCNQ0lF_Ia_F5TKMsbgozIH2ClfDYMx1aCjXtV5a8tt-rWtAy727cFPiAL2YDK95SS1LLOg=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/notification.png"
                                                title="notification"
                                                class="CToWUd"
                                                data-bit="iit"
                                              />
                                            </td>
                                            <td
                                              align="left"
                                              style="
                                                font-size: 14px;
                                                color: #303233;
                                                font-weight: bold;
                                                margin-left: 12px;
                                              "
                                            >
                                              Lưu ý
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="padding-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 12px;
                                                color: #303233;
                                                line-height: 18px;
                                              "
                                            >
                                              <ul
                                                style="
                                                  list-style-type: disc;
                                                  margin: 0 0 0px 15px;
                                                  padding: 0;
                                                "
                                              >
                                                <li>
                                                  Khi được yêu cầu, vui lòng
                                                  xuất trình giấy tờ tùy thân để
                                                  chứng thực độ tuổi khi xem
                                                  phim.
                                                </li>
                                                <li>
                                                  Các vé xem phim Lotte mua trên
                                                  <span class="il">429 Cinema</span>
                                                  sẽ không được hoàn tiền và
                                                  tích điểm Lpoint vào Lotte
                                                  Group.
                                                </li>
                                              </ul>
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="left">
                                            <td
                                              align="left"
                                              style="padding-right: 5px"
                                            >
                                              <img
                                                height="24"
                                                width="24"
                                                style="
                                                  border: none;
                                                  clear: both;
                                                  display: inline-block;
                                                  height: 24px;
                                                  max-width: 100%;
                                                  outline: 0;
                                                  text-decoration: none;
                                                  vertical-align: middle;
                                                  width: 24px;
                                                "
                                                src="https://ci3.googleusercontent.com/meips/ADKq_NZ2vysB6CG3y93Bgj93-BeCP46nSRgXr6Z3gklT-IbKNzGH-vCiJN3mpr5mXpG_qLq3IoCFBIfgVae-ZZ8ppYJT5r7cLGsVRUpwmhyr=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/phone.png"
                                                title="phone"
                                                class="CToWUd"
                                                data-bit="iit"
                                              />
                                            </td>
                                            <td
                                              align="left"
                                              style="
                                                font-size: 14px;
                                                color: #303233;
                                                font-weight: bold;
                                                margin-left: 12px;
                                              "
                                            >
                                              Liên hệ hỗ trợ
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="padding-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 12px;
                                                color: #303233;
                                              "
                                            >
                                              Trong trường hợp này, bạn vui lòng
                                              dùng chính số điện thoại đăng ký
                                              tài khoản
                                              <span class="il">429 Cinema</span> để
                                              liên hệ đến tổng đài
                                              <span class="il">429 Cinema</span>. Nhân
                                              viên CSKH sẽ xác minh thông tin và
                                              hỗ trợ. Trong bất kỳ trường hợp
                                              nào khác, vui lòng liên hệ trực
                                              tiếp với tổng đài
                                              <span class="il">429 Cinema</span> tại
                                              số 1900 54 54 41 hoặc 028 399 17
                                              199.
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                      >
                                        <tbody>
                                          <tr align="left">
                                            <td
                                              align="left"
                                              style="padding-right: 5px"
                                            >
                                              <img
                                                height="24"
                                                width="24"
                                                style="
                                                  border: none;
                                                  clear: both;
                                                  display: inline-block;
                                                  height: 24px;
                                                  max-width: 100%;
                                                  outline: 0;
                                                  text-decoration: none;
                                                  vertical-align: middle;
                                                  width: 24px;
                                                "
                                                src="https://ci3.googleusercontent.com/meips/ADKq_NbdrwOyprABOL-C_G8KbuNWZehCcCKPuGBIUMzqEeQcfFy7U4TV2t4u6T6WS2v-aaSfLXyvWQ-kV9FSj76_OEK8echybBnHlRV-o8FFOr8=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/account.png"
                                                title="account"
                                                class="CToWUd"
                                                data-bit="iit"
                                              />
                                            </td>
                                            <td
                                              align="left"
                                              style="
                                                font-size: 14px;
                                                color: #303233;
                                                font-weight: bold;
                                                margin-left: 12px;
                                              "
                                            >
                                              Trung tâm trợ giúp
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                  <tr align="left">
                                    <td>
                                      <table
                                        border="0"
                                        align="left"
                                        cellpadding="0"
                                        cellspacing="0"
                                        style="padding-bottom: 12px"
                                      >
                                        <tbody>
                                          <tr>
                                            <td
                                              style="
                                                font-size: 12px;
                                                color: #303233;
                                                line-height: 18px;
                                              "
                                            >
                                              Bấm vào
                                              <a
                                                href="https://momoapp.page.link/6th7gLMPsEYgR8cy8"
                                                target="_blank"
                                                data-saferedirecturl="https://www.google.com/url?q=https://momoapp.page.link/6th7gLMPsEYgR8cy8&amp;source=gmail&amp;ust=1724757323413000&amp;usg=AOvVaw0muGtDa9hm8L-doLuiGWxD"
                                                ><b>đây</b></a
                                              >
                                              để đến trung tâm trợ giúp trên
                                              <span class="il"></span>.
                                            </td>
                                          </tr>
                                        </tbody>
                                      </table>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="yj6qo"></div>
      <div class="adL"></div>
    </div>
  </body>
  `;
}

module.exports = generateEmailHtml;
