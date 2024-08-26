// Hàm tạo nội dung HTML cho email
function generateEmailHtml(ticket) {
  const hasExtras = ticket.extras && ticket.extras.length > 0;
  const extrasHtml = hasExtras
    ? ticket.extras
        .map((extra) => `<span>${extra.quantity} x ${extra.itemId.name}</span>`)
        .join(", ")
    : "Không có";
  return `<div>
<table width="100%" border="0" cellspacing="0" cellpadding="0">
    <tbody>
    <tr><td align="center" style="min-width:512px;background-color:#f3f3f3">
        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
            <tbody>
            <tr>
                <td align="center" style="padding-bottom:0px">
                    <table align="center" width="512" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                            <td align="center" style="padding-top:10px;padding-bottom:15px">
                                <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr>
                                        <td style="border-top:3px solid #ae2070;border-radius:4px 4px 0 0">
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="padding-top:25px;padding-bottom:25px;background-color:white">
                                <a href="https://www.momo.vn/" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.momo.vn/&amp;source=gmail&amp;ust=1724757323412000&amp;usg=AOvVaw0u6lH6WgNj654XKjXXbQPY"><img src="https://ci6.googleusercontent.com/proxy/Ft0j3uAtdXH8aomYNow45qhUCHgHyuxBBHqCjL7AX5uNBbYIJRTrDsu53O5-7CvfBUJgLRVW6ng8IB5m40XEd0HJ5x27-jLW1CK6B7kcOVNZB8tkueOU21-aVyvXFDbbAsRDN6Uhfwn83g=s0-d-e1-ft#https://static.mservice.io/images/s/momo-upload-api-191029110856-637079441360238984.png" width="42" height="42" alt="Ví điện tử MoMo" style="display:block;border:0;font-size:20px;font-weight:bold;color:#22222" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0."></a>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr><td>
                                        <img src="https://ci3.googleusercontent.com/meips/ADKq_Nb4_CdH6ivMV5KKC_7dZJeRIFgPMT36aYr6lv1KtFbbaYbkwwboMuqe4EtJr0sKtSO5FxCjpxamr-DPYaXx2jcj5jqq_Ao5gPpCNz1ur7UInVOcaKE=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/banner_cinema.png" width="100%" alt="Ví điện tử MoMo" style="object-fit:contain;display:block;border:0" class="CToWUd a6T" data-bit="iit" tabindex="0"><div class="a6S" dir="ltr" style="opacity: 0.01; left: 841.582px; top: 265.699px;"><span data-is-tooltip-wrapper="true" class="a5q" jsaction="JIbuQc:.CLIENT"><button class="VYBDae-JX-I VYBDae-JX-I-ql-ay5-ays CgzRE" jscontroller="PIVayb" jsaction="click:h5M12e; clickmod:h5M12e;pointerdown:FEiYhc;pointerup:mF5Elf;pointerenter:EX0mI;pointerleave:vpvbp;pointercancel:xyn4sd;contextmenu:xexox;focus:h06R8; blur:zjh6rb;mlnRJb:fLiPzd;" data-idom-class="CgzRE" jsname="hRZeKc" aria-label="Tải xuống tệp đính kèm " data-tooltip-enabled="true" data-tooltip-id="tt-c18" data-tooltip-classes="AZPksf" id="" jslog="91252; u014N:cOuCgd,Kr2w4b,xr6bB; 4:WyIjbXNnLWY6MTc5MDc1NjQwMTE4ODA5NjE2NCJd; 43:WyJpbWFnZS9qcGVnIl0."><span class="OiePBf-zPjgPe VYBDae-JX-UHGRz"></span><span class="bHC-Q" data-unbounded="false" jscontroller="LBaJxb" jsname="m9ZlFb" soy-skip="" ssk="6:RWVI5c"></span><span class="VYBDae-JX-ank-Rtc0Jf" jsname="S5tZuc" aria-hidden="true"><span class="bzc-ank" aria-hidden="true"><svg viewBox="0 -960 960 960" height="20" width="20" focusable="false" class=" aoH"><path d="M480-336L288-528l51-51L444-474V-816h72v342L621-579l51,51L480-336ZM263.72-192Q234-192 213-213.15T192-264v-72h72v72H696v-72h72v72q0,29.7-21.16,50.85T695.96-192H263.72Z"></path></svg></span></span><div class="VYBDae-JX-ano"></div></button><div class="ne2Ple-oshW8e-J9" id="tt-c18" role="tooltip" aria-hidden="true">Tải xuống</div></span></div>
                                    </td>
                                    </tr></tbody>
                                </table>

                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr><td align="left" style="padding-top:25px;padding-bottom:25px;background-color:white">
                                        <p style="margin:0 0 0 0;color:#303233;font-size:12px;margin:0;padding-bottom:10px">
                                            Xin chào <span style="color:#303233;font-size:12px;font-weight:bold">Chau Nguyen Anh,</span>
                                        </p>
                                        <p style="margin:0 0 0 0;color:#303233;font-size:12px">
                                            <br> Cảm ơn bạn đã sử dụng dịch vụ của <span class="il">MoMo</span>!<br>
                                            <span class="il">MoMo</span> xác nhận bạn đã đặt vé xem phim của <span style="font-weight:bold;font-size:12px">CGV Buôn Mê Thuột</span> thành
                                            công lúc <span style="font-weight:bold;font-size:12px">11:26:26 13/02/2024.</span> <br> Chi tiết vé của bạn
                                            như sau: </p>
                                    </td>
                                    </tr></tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                    <tbody>
                                    <tr>
                                        <td align="left" style="padding-top:25px;padding-bottom:0px;background-color:white;border:1px solid #e8e8e8;border-radius:12px">
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="color:#303233;font-size:16px;padding-bottom:5px">
                                                        <strong>Mã đặt vé</strong></td>
                                                </tr>
                                                <tr align="center">
                                                    <td style="color:#eb2f96;font-size:20px;padding-bottom:10px">
                                                        <strong>442851818</strong></td>
                                                </tr>
                                                <tr align="center">
                                                    <td align="center">
                                                        <table border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:10px">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td align="center" style="padding:2px;background-color:white;border:1px solid #e8e8e8;border-radius:12px">
                                                                    <img src="https://mail.google.com/mail/u/0?ui=2&amp;ik=6cf858cde0&amp;attid=0.0.1&amp;permmsgid=msg-f:1790756401188096164&amp;th=18da0b758412c8a4&amp;view=fimg&amp;fur=ip&amp;sz=s0-l75-ft&amp;attbid=ANGjdJ-5B4Pfo4Pu026skBIaVDaYORlFXMt4v8_wLhB0fFjV2zA0XBBCBqOODw4sdl0iLQZ7WUZehG12c_D9Jg9Cvl-scuBUckRhzEHzac7E2bLSzZJb_ESwfidkEvU&amp;disp=emb" width="280px" alt="Ví điện tử MoMo" style="object-fit:contain;display:block;border:0" data-image-whitelisted="" class="CToWUd" data-bit="iit">
                                                                   
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>


                                                    </td>
                                                </tr>
                                                <tr align="center">
                                                    <td style="color:#727272;font-size:12px;padding-bottom:15px">Đem
                                                        mã QR này đến quầy giao dịch hoặc nhân viên soát vé để nhận vé
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="padding-left:12px;padding-right:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td style="padding:0px 0px 1px 0px" bgcolor="#e8e8e8" width="100%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="color:#727272;font-size:14px">Thời gian chiếu</td>
                                                </tr>
                                                <tr align="center">
                                                    <td style="color:#303233;font-size:14px">
                                                        <strong>10:50:00 14/02/2024</strong></td>
                                                </tr>
                                                
                                                </tbody>
                                            </table>

                                            <table width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="padding:0px 0px 8px 0px" bgcolor="#f9f9f9" width="100%"></td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
                                                <tbody>
                                                <tr align="center">
                                                    <td>
                                                        <table width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="margin-left:12px">
                                                            <tbody>
                                                            <tr align="left">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Phim
                                                                </td>
                                                            </tr>
                                                            <tr align="left">
                                                                <td style="font-weight:bold;color:#303233">
                                                                    Gặp Lại Chị Bầu
                                                                </td>
                                                            </tr>
                                                            
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>


                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="vertical-align:top">
                                                        <table width="150" border="0" align="left" cellpadding="0" cellspacing="0" style="margin-left:12px;margin-right:12px">
                                                            <tbody>
                                                            <tr align="left">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Phòng Chiếu
                                                                </td>
                                                            </tr>
                                                            <tr align="left">
                                                                <td style="color:#303233;font-size:14px">
                                                                    Cinema 2
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td style="vertical-align:top">
                                                        <table width="150" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-left:10px;margin-right:10px">
                                                            <tbody>
                                                            <tr align="left">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Số Vé
                                                                </td>
                                                            </tr>
                                                            <tr align="left">
                                                                <td style="color:#303233;font-size:14px">
                                                                    2
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                    <td style="vertical-align:top">
                                                        <table width="100%" border="0" align="right" cellpadding="0" cellspacing="0" style="margin-left:12px;margin-right:12px">
                                                            <tbody>
                                                            <tr align="left" style="margin-right:12px">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Số Ghế
                                                                </td>
                                                            </tr>
                                                            <tr align="left" style="margin-right:12px">
                                                                <td style="color:#303233;font-size:14px">
                                                                    G07, G06
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="padding-left:12px;padding-right:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td style="padding:0px 0px 1px 0px" bgcolor="#e8e8e8" width="100%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
                                                <tbody>
                                                <tr align="center">
                                                    <td>
                                                        <table width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="margin-left:12px">
                                                            <tbody>
                                                            <tr align="left">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Thức ăn kèm
                                                                </td>
                                                            </tr>
                                                            <tr align="left"><td style="font-weight:bold;color:#303233">1 x MY COMBO    </td></tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>

                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="padding-left:12px;padding-right:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td style="padding:0px 0px 1px 0px" bgcolor="#e8e8e8" width="100%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:8px">
                                                <tbody>
                                                <tr align="center">
                                                    <td>
                                                        <table width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="margin-left:12px">
                                                            <tbody>
                                                            <tr align="left">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Rạp chiếu
                                                                </td>
                                                            </tr>
                                                            <tr align="left">
                                                                <td style="font-weight:bold;color:#303233">
                                                                    CGV Buôn Mê Thuột
                                                                </td>
                                                            </tr>
                                                            <tr align="left">
                                                                <td style="color:#727272;font-size:14px">
                                                                    Tầng 4 TTTM Nguyễn Kim, số 01 Nguyễn Chí Thanh, phường Tân An, thành phố Buôn Ma Thuột, tỉnh Đak Lak
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>

                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="center">
                                                    <td style="background-color:#f0f0f0;padding-top:22px;padding-bottom:22px;border-bottom-left-radius:12px;border-bottom-right-radius:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td align="left" style="color:#303233;font-size:14px;padding-left:12px">
                                                                    Tổng tiền
                                                                </td>
                                                                <td align="right" style="color:#303233;font-size:20px;font-weight:bold;padding-right:12px">
                                                                    256,818
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                    </td></tr></tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                    <tbody>
                                    <tr>
                                        <td align="left" style="padding-top:16px;padding-bottom:0px;background-color:white;border:1px solid #e8e8e8;border-radius:12px">
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="left">
                                                    <td style="color:#303233;font-size:16px;padding-left:12px;padding-bottom:16px">
                                                        <strong>Thông tin người nhận vé</strong></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-bottom:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td style="padding:0px 0px 1px 0px" bgcolor="#e8e8e8" width="100%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr align="left">
                                                    <td style="color:#303233;font-size:16px;padding-left:12px;padding-bottom:14px">
                                                        <strong>1. Người đặt</strong></td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-bottom:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td align="left" style="color:#727272;font-size:14px;padding-left:12px">
                                                                    Họ và tên
                                                                </td>
                                                                <td align="right" style="color:#303233;font-size:14px;font-weight:bold;text-align:right;padding-right:12px">
                                                                    Chau Nguyen Anh
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-right:12px;padding-left:12px;padding-bottom:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td style="padding:0px 0px 1px 0px" bgcolor="#e8e8e8" width="100%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>

                                                </tr>
                                                <tr>
                                                    <td style="padding-bottom:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td align="left" style="color:#727272;font-size:14px;padding-left:12px">
                                                                    Số điện thoại
                                                                </td>
                                                                <td align="right" style="color:#303233;font-size:14px;font-weight:bold;text-align:right;padding-right:12px">
                                                                    0923055947
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td style="padding-right:12px;padding-left:12px;padding-bottom:12px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td style="padding:0px 0px 1px 0px" bgcolor="#e8e8e8" width="100%"></td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>

                                                </tr>
                                                <tr>
                                                    <td style="padding-bottom:24px">
                                                        <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                            <tr align="center">
                                                                <td align="left" style="color:#727272;font-size:14px;padding-left:12px">
                                                                    Email
                                                                </td>
                                                                <td align="right" style="color:#303233;font-size:14px;font-weight:bold;text-align:right;padding-right:12px">
                                                                    <a href="mailto:nguyenanh1997dz@gmail.com" target="_blank">nguyenanh1997dz@gmail.com</a>
                                                                </td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                
                                                </tbody>
                                            </table>
                                    </td></tr></tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr align="left">
                                        <td style="font-size:10px;color:#303233">Xem vé này trên ví <span class="il">MoMo</span> của bạn</td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <a href="https://page.momoapp.vn/vWa3N4pE5po" style="Margin:0;color:#9b9b9b;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://page.momoapp.vn/vWa3N4pE5po&amp;source=gmail&amp;ust=1724757323412000&amp;usg=AOvVaw0FcZ0wXEg68-B5cCIXx8If">
                                                <table border="0" align="left" cellpadding="0" cellspacing="0">
                                                    <tbody>
                                                    <tr align="left">

                                                        <td align="left" style="font-size:16px;color:#d82d8b;font-weight:bold;padding-right:5px">
                                                            Quản lý vé
                                                        </td>
                                                        <td align="left">
                                                            <img height="24" width="24" style="border:none;clear:both;display:inline-block;height:24px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:24px" src="https://ci3.googleusercontent.com/meips/ADKq_Nag89YGKKwDDVu6JbH0wzmYzEeo41Eel-JwsJk4FoLOiLNQ-0miOsdtn6tQNI4rCYo7CUT0OHpX65-e271HvhIC0BiazEPsPhcLN5sq5yMdpg=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/next_pink.png" title="next" class="CToWUd" data-bit="iit">
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
                            <td align="center" style="background-color:white">
                                <table width="100%" border="0" align="left" cellpadding="0" cellspacing="0" style="margin-bottom:12px">
                                    <tbody>
                                    <tr align="center">
                                        <td style="padding:0px 0px 8px 0px" bgcolor="#f9f9f9" width="100%"></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:white">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="left">
                                                    <td align="left" style="padding-right:5px">
                                                        <img height="24" width="24" style="border:none;clear:both;display:inline-block;height:24px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:24px" src="https://ci3.googleusercontent.com/meips/ADKq_NbDbI7AFOEGukr9ibA7Bwgv2W9kJatbhSR48PWDXx_cKt5DPlBCkgMtH-vo4gJXBFL7PFBGv1h4ktvxNgtvCOYVtzZka_oJJ5WiC8A=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/file.png" title="next" class="CToWUd" data-bit="iit">
                                                    </td>
                                                    <td align="left" style="font-size:14px;color:#303233;font-weight:bold;margin-left:12px">
                                                        Chính sách hoàn/ huỷ
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="padding-bottom:12px">
                                                <tbody>
                                                <tr>
                                                    <td style="font-size:12px;color:#303233">
                                                        <span class="il">MoMo</span> không hỗ trợ đổi trả đối với các vé xem phim đã mua thành công qua ứng dụng <span class="il">MoMo</span>. 
Trường hợp giao dịch của bạn đang chờ xử lý, vui lòng liên hệ với tổng đài <span class="il">MoMo</span> để được hỗ trợ kịp thời.
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="left">
                                                    <td align="left" style="padding-right:5px">
                                                        <img height="24" width="24" style="border:none;clear:both;display:inline-block;height:24px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:24px" src="https://ci3.googleusercontent.com/meips/ADKq_Na8nQbWHNw0GNMKsJimaeA3YYNm2RzEzTPk7T8uHUtrCNQ0lF_Ia_F5TKMsbgozIH2ClfDYMx1aCjXtV5a8tt-rWtAy727cFPiAL2YDK95SS1LLOg=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/notification.png" title="notification" class="CToWUd" data-bit="iit">
                                                    </td>
                                                    <td align="left" style="font-size:14px;color:#303233;font-weight:bold;margin-left:12px">
                                                        Lưu ý
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="padding-bottom:12px">
                                                <tbody>
                                                <tr>
                                                    <td style="font-size:12px;color:#303233;line-height:18px">
                                                       <ul style="list-style-type:disc;margin:0 0 0px 15px;padding:0">
                                                            <li>Khi được yêu cầu, vui lòng xuất trình giấy tờ tùy thân để chứng thực độ tuổi khi xem phim.
                                                            </li>
                                                            <li>Các vé xem phim Lotte mua trên <span class="il">MoMo</span> sẽ không được hoàn tiền và tích điểm Lpoint vào Lotte Group.</li>
                                                            </ul>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="left">
                                                    <td align="left" style="padding-right:5px">
                                                        <img height="24" width="24" style="border:none;clear:both;display:inline-block;height:24px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:24px" src="https://ci3.googleusercontent.com/meips/ADKq_NZ2vysB6CG3y93Bgj93-BeCP46nSRgXr6Z3gklT-IbKNzGH-vCiJN3mpr5mXpG_qLq3IoCFBIfgVae-ZZ8ppYJT5r7cLGsVRUpwmhyr=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/phone.png" title="phone" class="CToWUd" data-bit="iit">
                                                    </td>
                                                    <td align="left" style="font-size:14px;color:#303233;font-weight:bold;margin-left:12px">
                                                        Liên hệ hỗ trợ
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="padding-bottom:12px">
                                                <tbody>
                                                <tr>
                                                    <td style="font-size:12px;color:#303233">
                                                        Trong trường hợp này, bạn vui lòng dùng chính số điện thoại đăng
                                                        ký tài khoản <span class="il">MoMo</span> để liên hệ đến tổng đài <span class="il">MoMo</span>. Nhân viên CSKH
                                                        sẽ xác minh thông tin và hỗ trợ. Trong bất kỳ trường hợp nào
                                                        khác, vui lòng liên hệ trực tiếp với tổng đài <span class="il">MoMo</span> tại số 1900
                                                        54 54 41 hoặc 028 399 17 199.
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr align="left">
                                                    <td align="left" style="padding-right:5px">
                                                        <img height="24" width="24" style="border:none;clear:both;display:inline-block;height:24px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:24px" src="https://ci3.googleusercontent.com/meips/ADKq_NbdrwOyprABOL-C_G8KbuNWZehCcCKPuGBIUMzqEeQcfFy7U4TV2t4u6T6WS2v-aaSfLXyvWQ-kV9FSj76_OEK8echybBnHlRV-o8FFOr8=s0-d-e1-ft#https://cdn.mservice.com.vn/app/img/ota/email/account.png" title="account" class="CToWUd" data-bit="iit">
                                                    </td>
                                                    <td align="left" style="font-size:14px;color:#303233;font-weight:bold;margin-left:12px">
                                                        Trung tâm trợ giúp
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr align="left">
                                        <td>
                                            <table border="0" align="left" cellpadding="0" cellspacing="0" style="padding-bottom:12px">
                                                <tbody>
                                                <tr>
                                                    <td style="font-size:12px;color:#303233;line-height:18px">
                                                        Bấm vào <a href="https://momoapp.page.link/6th7gLMPsEYgR8cy8" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://momoapp.page.link/6th7gLMPsEYgR8cy8&amp;source=gmail&amp;ust=1724757323413000&amp;usg=AOvVaw0muGtDa9hm8L-doLuiGWxD"><b>đây</b></a> để đến trung tâm trợ giúp trên <span class="il">MoMo</span>.
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
                <td align="center">
                    <table align="center" width="512" border="0" cellspacing="0" cellpadding="0">
                        <tbody>
                        <tr>
                            <td align="center" style="background-color:#ae2070;padding-top:20px;padding-bottom:20px">
                                <table width="90%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr>
                                        <td>
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr>
                                                    <td style="padding:0;margin:0">

                                                        <div style="color:#f3e6ec;display:block;font-family:sans-serif;font-size:13px;font-weight:700;line-height:19px;margin:0px;padding:0px">

                                                            Công ty Cổ phần dịch
                                                            vụ Di Động
                                                            <br>
                                                            Trực Tuyến
                                                            (M_Service)
                                                        </div>
                                                        <div style="margin:5px 0 0 0;color:#f3e6ec;display:block;font-family:sans-serif;font-size:12px;font-weight:normal;line-height:20px">
                                                            12 Tân Trào, Phường
                                                            Tân Phú,
                                                            Quận 7, TP.HCM
                                                        </div>
                                                    </td>
                                                    <td style="padding:0;text-align:right">
                                                        <div style="color:#737373;margin:10px 0;font-size:12px;line-height:22px;text-transform:uppercase;font-weight:bold">
                                                            <a href="https://www.facebook.com/vimomo/" style="Margin:0;color:#9b9b9b;font-family:Roboto,Helvetica,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.facebook.com/vimomo/&amp;source=gmail&amp;ust=1724757323413000&amp;usg=AOvVaw1tFo7fT_lfLINiBMJgz-JG">

                                                                <img height="26" width="26" style="border:none;clear:both;display:inline-block;height:26px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:26px" src="https://ci5.googleusercontent.com/proxy/sHQrymeM5KQ-F86v_-vxy9A48n8xUk_pHIj5y5doeQtxm6q7cB6Qd7psf-NcB-vPIWhAvnNrFDkpdJngemkbh_Cj8Uc5uCanGfO_W7iIJtGNASgVdruzlif4eMOc09K4DkxJQiqRPPBiYA=s0-d-e1-ft#https://static.mservice.io/images/s/momo-upload-api-191105150846-637085633269386698.png" title="facebook" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                                                            </a>&nbsp;&nbsp;
                                                            <a href="https://momo.vn/" style="Margin:0;color:#9b9b9b;font-family:Roboto,Helvetica,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://momo.vn/&amp;source=gmail&amp;ust=1724757323413000&amp;usg=AOvVaw2u9mX893dFzLPiCufNrfWI">
                                                                <img height="26" width="26" style="border:none;clear:both;display:inline-block;height:26px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:26px" src="https://ci4.googleusercontent.com/proxy/oORNn-LtrHgsiNysIssG4R2mAgOEV-mbe9v9I8tuWR4eBXMY7l-WyhPjxQGr7jYaxqsZsc_K60pwu3_RxJvGdpNDB_LKkYbCm78bcevmHe1OTfnG06uv_6r8uOud0DFbLa7qHKLxlIcz8A=s0-d-e1-ft#https://static.mservice.io/images/s/momo-upload-api-191105150920-637085633600093600.png" title="momo" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                                                            </a>&nbsp;&nbsp;
                                                            <a href="mailto:hotro@momo.vn" style="Margin:0;color:#9b9b9b;font-family:Roboto,Helvetica,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left" target="_blank">
                                                                <img height="26" width="26" style="border:none;clear:both;display:inline-block;height:26px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:26px" src="https://ci4.googleusercontent.com/proxy/TwzLO-58hn4IBTemaQnEL_-eYcHvphCO6iZNExO9wrbLMCiX2_tm5pw2YOHwkCqcUb2rh5CHfgG_3t-qEBDno6Cpf9SRhcYQnFs199rd9Y5kl_t8Xbn1QkWbIYUxJh-zAEdZRhSR3zLwRA=s0-d-e1-ft#https://static.mservice.io/images/s/momo-upload-api-191105150941-637085633813746314.png" title="email" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                                                            </a>&nbsp;&nbsp;
                                                            <a href="https://www.youtube.com/channel/UCKHHW-qL2JoZqcSNm1jPlqw" style="Margin:0;color:#9b9b9b;font-family:Roboto,Helvetica,sans-serif;font-weight:400;line-height:1.3;margin:0;padding:0;text-align:left" target="_blank" data-saferedirecturl="https://www.google.com/url?q=https://www.youtube.com/channel/UCKHHW-qL2JoZqcSNm1jPlqw&amp;source=gmail&amp;ust=1724757323413000&amp;usg=AOvVaw3w7nJlCM_AXMvRJ4EMHVZz">
                                                                <img height="26" width="26" style="border:none;clear:both;display:inline-block;height:26px;max-width:100%;outline:0;text-decoration:none;vertical-align:middle;width:26px" src="https://ci5.googleusercontent.com/proxy/bSmZZW4ot-BNb3kpBfVqJz8J7wjeQ7b5p9fX_KyVGuSbN9zDiQ0kzd2tdE80HTb5gFRbUHShGlgYitbj9_Rze9NZV449sDx8ptVr3pmPNZ3uTSIgdv4YfPd-egCdSR-L0fuqIz2IqmDGGw=s0-d-e1-ft#https://static.mservice.io/images/s/momo-upload-api-191105151010-637085634100025706.png" title="youtube" class="CToWUd" data-bit="iit" jslog="138226; u014N:xr6bB; 53:WzAsMl0.">
                                                            </a>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td align="center" style="padding:10px 0 10px">
                                            <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                                <tbody>
                                                <tr>
                                                    <td style="border-top:1px dashed #bf6191">
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <div style="color:#e5c6d5;display:block;font-family:sans-serif;font-size:11px;font-weight:normal;text-align:center;line-height:17px;margin:0px;padding:0px">
                                                Bạn đang được nhận email từ tài
                                                khoản
                                                <strong>Ví <span class="il">MoMo</span>
                                                    ********617</strong>
                                            </div>
                                            <div style="color:#e5c6d5;display:block;font-family:sans-serif;font-size:11px;font-weight:normal;text-align:center;line-height:17px;margin:0px;padding:0px;margin-top:0px">
                                                Bạn có thể thay đổi tùy chọn
                                                email
                                                tại
                                                mục <strong>VÍ CỦA TÔI</strong>
                                                trong
                                                ứng dụng.
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>

                            </td>
                        </tr>
                        <tr>
                            <td align="center" style="background-color:#f5f5f6">
                                <table width="100%" border="0" align="center" cellpadding="0" cellspacing="0">
                                    <tbody>
                                    <tr>
                                        <td style="border-top:1px solid #f5f5f6"></td>
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
    </td></tr>
    </tbody>
</table><div class="yj6qo"></div><div class="adL">
</div></div>`;
}

module.exports = generateEmailHtml;
