import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.qq.com",
  port: 587,
  auth: {
    user: "2464334130@qq.com",
    pass: "bpjhzwduyxduecad",
  },
});

export const send = async (email: string, code: string) => {
  try {
    await transporter.sendMail({
      from: '"justinsun" <2464334130@qq.com>', // 发送者地址
      to: email, // 收件人地址
      subject: "Hello!", // 主题
      text: `Your verification code is: ${code}`, // 纯文本邮件内容
      html: `<!DOCTYPE html>
<html
  lang="en"
  xmlns="http://www.w3.org/1999/xhtml"
  xmlns:v="urn:schemas-microsoft-com:vml"
  xmlns:o="urn:schemas-microsoft-com:office:office"
>
  <head>
    <title>Welcome to [Coded Mails]</title>
    <!--[if !mso]><!-- -->
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <!--<![endif]-->
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style type="text/css">
      #outlook a {
        padding: 0;
      }

      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      table,
      td {
        border-collapse: collapse;
        mso-table-lspace: 0pt;
        mso-table-rspace: 0pt;
      }

      img {
        border: 0;
        height: auto;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      p {
        display: block;
        margin: 13px 0;
      }
    </style>
    <!--[if mso]>
      <xml>
        <o:OfficeDocumentSettings>
          <o:AllowPNG />
          <o:PixelsPerInch>96</o:PixelsPerInch>
        </o:OfficeDocumentSettings>
      </xml>
    <![endif]-->
    <!--[if lte mso 11]>
      <style type="text/css">
        .mj-outlook-group-fix {
          width: 100% !important;
        }
      </style>
    <![endif]-->
    <!--[if !mso]><!-->
    <link
      href="https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@400;500;600&amp;display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <link
      href="https://fonts.googleapis.com/css2?family=Montserrat&amp;display=swap"
      rel="stylesheet"
      type="text/css"
    />
    <style type="text/css">
      @import url(https://fonts.googleapis.com/css2?family=Inknut+Antiqua:wght@400;500;600&amp;display=swap);
      @import url(https://fonts.googleapis.com/css2?family=Montserrat&amp;display=swap);
    </style>
    <!--<![endif]-->
    <style type="text/css">
      @media only screen and (min-width: 480px) {
        .mj-column-per-100 {
          width: 100% !important;
          max-width: 100%;
        }
      }
    </style>
    <style type="text/css">
      @media only screen and (max-width: 480px) {
        table.mj-full-width-mobile {
          width: 100% !important;
        }

        td.mj-full-width-mobile {
          width: auto !important;
        }
      }
    </style>
    <style type="text/css">
      a,
      span,
      td,
      th {
        -webkit-font-smoothing: antialiased !important;
        -moz-osx-font-smoothing: grayscale !important;
      }
    </style>
  </head>

  <body style="background-color: #171919">
    <div
      style="
        display: none;
        font-size: 1px;
        color: #ffffff;
        line-height: 1px;
        max-height: 0px;
        max-width: 0px;
        opacity: 0;
        overflow: hidden;
      "
    >
      Preview - Welcome to Coded Mails
    </div>
    <div style="background-color: #171919">
      <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  padding-bottom: 0px;
                  text-align: center;
                "
              >
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:middle;width:600px;"
            >
          <![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: middle;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: middle"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td style="width: 150px">
                                  <img
                                    alt="Logo"
                                    height="auto"
                                    src="https://codedmails.com/images/logo-white.png"
                                    style="
                                      border: 0;
                                      display: block;
                                      outline: none;
                                      text-decoration: none;
                                      height: auto;
                                      width: 100%;
                                      font-size: 14px;
                                    "
                                    width="150"
                                  />
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
      <div style="margin: 0px auto; max-width: 600px">
        <table
          align="center"
          border="0"
          cellpadding="0"
          cellspacing="0"
          role="presentation"
          style="width: 100%"
        >
          <tbody>
            <tr>
              <td
                style="
                  direction: ltr;
                  font-size: 0px;
                  padding: 20px 0;
                  text-align: center;
                "
              >
                <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                <div
                  class="mj-column-per-100 mj-outlook-group-fix"
                  style="
                    font-size: 0px;
                    text-align: left;
                    direction: ltr;
                    display: inline-block;
                    vertical-align: top;
                    width: 100%;
                  "
                >
                  <table
                    border="0"
                    cellpadding="0"
                    cellspacing="0"
                    role="presentation"
                    style="vertical-align: top"
                    width="100%"
                  >
                    <tbody>
                      <tr>
                        <td
                          align="center"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="
                              border-collapse: collapse;
                              border-spacing: 0px;
                            "
                          >
                            <tbody>
                              <tr>
                                <td style="width: 550px">
                                  <!-- <img alt="welcome image" height="auto" src="https://ouch-cdn.icons8.com/preview/45/ae8b07c8-d018-4205-8011-29f727059dd7.png" style="border:0;display:block;outline:none;text-decoration:none;height:auto;width:100%;font-size:14px;" width="550" /> -->
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Montserrat, Helvetica, Arial,
                                sans-serif;
                              font-size: 18px;
                              font-weight: 400;
                              line-height: 24px;
                              text-align: left;
                              color: #dddddd;
                            "
                          >
                            <h1
                              style="
                                margin: 0;
                                font-size: 46px;
                                line-height: 60px;
                                font-weight: 600;
                                font-family: 'Inknut Antiqua', Helvetica, Arial,
                                  sans-serif;
                              "
                            >
                              Lets create something amazing!
                            </h1>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Montserrat, Helvetica, Arial,
                                sans-serif;
                              font-size: 18px;
                              font-weight: 400;
                              line-height: 24px;
                              text-align: left;
                              color: #dddddd;
                            "
                          >
                            <p style="margin: 0">
                              Welcome to [justinsun's blog]! Before we get
                              started, please confirm your email address with
                              the following code.
                            </p>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          vertical-align="middle"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="border-collapse: separate; line-height: 100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  bgcolor="#ffffff"
                                  role="presentation"
                                  style="
                                    border: none;
                                    border-radius: 3px;
                                    cursor: auto;
                                    mso-padding-alt: 10px 25px;
                                    background: #ffffff;
                                  "
                                  valign="middle"
                                >
                                  <a
                                    href=""
                                    style="
                                      display: inline-block;
                                      background: #ffffff;
                                      color: #000000;
                                      font-family: Montserrat, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 14px;
                                      font-weight: normal;
                                      line-height: 30px;
                                      margin: 0;
                                      text-decoration: none;
                                      text-transform: none;
                                      padding: 10px 25px;
                                      mso-padding-alt: 0px;
                                      border-radius: 3px;
                                    "
                                    target="_blank"
                                    onclick="event.preventDefault();"
                                    <!--
                                    禁止点击事件
                                    --
                                  >
                                    ${code}
                                  </a>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td
                          align="left"
                          style="
                            font-size: 0px;
                            padding: 10px 25px;
                            word-break: break-word;
                          "
                        >
                          <div
                            style="
                              font-family: Montserrat, Helvetica, Arial,
                                sans-serif;
                              font-size: 16px;
                              font-weight: 400;
                              line-height: 24px;
                              text-align: left;
                              color: #999999;
                            "
                          >
                            <p style="margin: 0">
                              Have questions or need help? Email us at
                              <a
                                href="#"
                                style="
                                  color: #ffffff;
                                  text-decoration: none;
                                  font-weight: bold;
                                "
                              >
                                hello@codedmails.com
                              </a>
                            </p>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
      <table
        align="center"
        border="0"
        cellpadding="0"
        cellspacing="0"
        role="presentation"
        style="background: #000000; background-color: #000000; width: 100%"
      >
        <tbody>
          <tr>
            <td>
              <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" class="" style="width:600px;" width="600"
      >
        <tr>
          <td style="line-height:0px;font-size:0px;mso-line-height-rule:exactly;">
      <![endif]-->
              <div style="margin: 0px auto; max-width: 600px">
                <table
                  align="center"
                  border="0"
                  cellpadding="0"
                  cellspacing="0"
                  role="presentation"
                  style="width: 100%"
                >
                  <tbody>
                    <tr>
                      <td
                        style="
                          direction: ltr;
                          font-size: 0px;
                          padding: 20px 0;
                          text-align: center;
                        "
                      >
                        <!--[if mso | IE]>
                  <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                
        <tr>
      
            <td
               class="" style="vertical-align:top;width:600px;"
            >
          <![endif]-->
                        <div
                          class="mj-column-per-100 mj-outlook-group-fix"
                          style="
                            font-size: 0px;
                            text-align: left;
                            direction: ltr;
                            display: inline-block;
                            vertical-align: top;
                            width: 100%;
                          "
                        >
                          <table
                            border="0"
                            cellpadding="0"
                            cellspacing="0"
                            role="presentation"
                            style="vertical-align: top"
                            width="100%"
                          >
                            <tbody>
                              <tr>
                                <td
                                  align="center"
                                  style="
                                    font-size: 0px;
                                    padding: 10px 25px;
                                    word-break: break-word;
                                  "
                                >
                                  <div
                                    style="
                                      font-family: Montserrat, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 400;
                                      line-height: 24px;
                                      text-align: center;
                                      color: #999999;
                                    "
                                  >
                                    <a
                                      class="footer-link"
                                      href="#"
                                      style="
                                        text-decoration: none;
                                        color: #fff;
                                        font-weight: 400;
                                      "
                                      >Support</a
                                    >
                                      |  
                                    <a
                                      class="footer-link"
                                      href="#"
                                      style="
                                        text-decoration: none;
                                        color: #fff;
                                        font-weight: 400;
                                      "
                                      >Privacy Policy</a
                                    >
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  align="center"
                                  style="
                                    font-size: 0px;
                                    padding: 10px 25px;
                                    word-break: break-word;
                                  "
                                >
                                  <div
                                    style="
                                      font-family: Montserrat, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 400;
                                      line-height: 24px;
                                      text-align: center;
                                      color: #999999;
                                    "
                                  >
                                    123 Medalling Jr., Suite 100, Parrot Park,
                                    CA 12345
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td
                                  align="center"
                                  style="
                                    font-size: 0px;
                                    padding: 10px 25px;
                                    word-break: break-word;
                                  "
                                >
                                  <!--[if mso | IE]>
      <table
         align="center" border="0" cellpadding="0" cellspacing="0" role="presentation"
      >
        <tr>
      
              <td>
            <![endif]-->
                                  <table
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="float: none; display: inline-table"
                                  >
                                    <tbody>
                                      <tr>
                                        <td style="padding: 4px">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              border-radius: 3px;
                                              width: 24px;
                                            "
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    font-size: 0;
                                                    height: 24px;
                                                    vertical-align: middle;
                                                    width: 24px;
                                                  "
                                                >
                                                  <a
                                                    href="#"
                                                    target="_blank"
                                                    style="
                                                      color: #ffffff;
                                                      text-decoration: none;
                                                      font-weight: bold;
                                                    "
                                                  >
                                                    <img
                                                      alt="twitter-logo"
                                                      height="24"
                                                      src="https://codedmails.com/images/social/light/twitter-logo-transparent-light.png"
                                                      style="
                                                        border-radius: 3px;
                                                        display: block;
                                                      "
                                                      width="24"
                                                    />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                                  <table
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="float: none; display: inline-table"
                                  >
                                    <tbody>
                                      <tr>
                                        <td style="padding: 4px">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              border-radius: 3px;
                                              width: 24px;
                                            "
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    font-size: 0;
                                                    height: 24px;
                                                    vertical-align: middle;
                                                    width: 24px;
                                                  "
                                                >
                                                  <a
                                                    href="#"
                                                    target="_blank"
                                                    style="
                                                      color: #ffffff;
                                                      text-decoration: none;
                                                      font-weight: bold;
                                                    "
                                                  >
                                                    <img
                                                      alt="facebook-logo"
                                                      height="24"
                                                      src="https://codedmails.com/images/social/light/facebook-logo-transparent-light.png"
                                                      style="
                                                        border-radius: 3px;
                                                        display: block;
                                                      "
                                                      width="24"
                                                    />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                                  <table
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="float: none; display: inline-table"
                                  >
                                    <tbody>
                                      <tr>
                                        <td style="padding: 4px">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              border-radius: 3px;
                                              width: 24px;
                                            "
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    font-size: 0;
                                                    height: 24px;
                                                    vertical-align: middle;
                                                    width: 24px;
                                                  "
                                                >
                                                  <a
                                                    href="#"
                                                    target="_blank"
                                                    style="
                                                      color: #ffffff;
                                                      text-decoration: none;
                                                      font-weight: bold;
                                                    "
                                                  >
                                                    <img
                                                      alt="instagram-logo"
                                                      height="24"
                                                      src="https://codedmails.com/images/social/light/instagram-logo-transparent-light.png"
                                                      style="
                                                        border-radius: 3px;
                                                        display: block;
                                                      "
                                                      width="24"
                                                    />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso | IE]>
              </td>
            
              <td>
            <![endif]-->
                                  <table
                                    align="center"
                                    border="0"
                                    cellpadding="0"
                                    cellspacing="0"
                                    role="presentation"
                                    style="float: none; display: inline-table"
                                  >
                                    <tbody>
                                      <tr>
                                        <td style="padding: 4px">
                                          <table
                                            border="0"
                                            cellpadding="0"
                                            cellspacing="0"
                                            role="presentation"
                                            style="
                                              border-radius: 3px;
                                              width: 24px;
                                            "
                                          >
                                            <tbody>
                                              <tr>
                                                <td
                                                  style="
                                                    font-size: 0;
                                                    height: 24px;
                                                    vertical-align: middle;
                                                    width: 24px;
                                                  "
                                                >
                                                  <a
                                                    href="#"
                                                    target="_blank"
                                                    style="
                                                      color: #ffffff;
                                                      text-decoration: none;
                                                      font-weight: bold;
                                                    "
                                                  >
                                                    <img
                                                      alt="dribbble-logo"
                                                      height="24"
                                                      src="https://codedmails.com/images/social/light/linkedin-logo-transparent-light.png"
                                                      style="
                                                        border-radius: 3px;
                                                        display: block;
                                                      "
                                                      width="24"
                                                    />
                                                  </a>
                                                </td>
                                              </tr>
                                            </tbody>
                                          </table>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                  <!--[if mso | IE]>
              </td>
            
          </tr>
        </table>
      <![endif]-->
                                </td>
                              </tr>
                              <tr>
                                <td
                                  style="font-size: 0px; word-break: break-word"
                                >
                                  <!--[if mso | IE]>
    
        <table role="presentation" border="0" cellpadding="0" cellspacing="0"><tr><td height="20" style="vertical-align:top;height:20px;">
      
    <![endif]-->
                                  <div style="height: 20px"> </div>
                                  <!--[if mso | IE]>
    
        </td></tr></table>
      
    <![endif]-->
                                </td>
                              </tr>
                              <tr>
                                <td
                                  align="center"
                                  style="
                                    font-size: 0px;
                                    padding: 10px 25px;
                                    word-break: break-word;
                                  "
                                >
                                  <div
                                    style="
                                      font-family: Montserrat, Helvetica, Arial,
                                        sans-serif;
                                      font-size: 16px;
                                      font-weight: 400;
                                      line-height: 24px;
                                      text-align: center;
                                      color: #999999;
                                    "
                                  >
                                    Update your
                                    <a
                                      class="footer-link"
                                      href="https://google.com"
                                      style="
                                        text-decoration: none;
                                        color: #fff;
                                        font-weight: 400;
                                      "
                                      >email preferences</a
                                    >
                                    to choose the types of emails you receive,
                                    or you can
                                    <a
                                      href="https://google.com"
                                      class="footer-link"
                                      style="
                                        text-decoration: none;
                                        color: #fff;
                                        font-weight: 400;
                                      "
                                    >
                                      unsubscribe </a
                                    >from all future emails.
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <!--[if mso | IE]>
            </td>
          
        </tr>
      
                  </table>
                <![endif]-->
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <!--[if mso | IE]>
          </td>
        </tr>
      </table>
      <![endif]-->
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </body>
</html>
`, // HTML格式邮件内容
    });
    console.log("Email sent successfully");
  } catch (err) {
    console.error("Error sending email:", err);
    throw err; // 抛出错误以确保外部的 catch 语句可以捕获
  }
};
