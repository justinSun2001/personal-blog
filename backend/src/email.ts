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
<html>
  <head>
    <title>Welcome to [Coded Mails]</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <style type="text/css">
      .container {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        font-family: 'Courier New', Courier, monospace;
      }
      .button {
        width: 200px;
        height: 100px;
        margin-top: 30px;
        background-color: #ffffff;
        border: 5px solid #295a2b;
        border-radius: 5px;
        color: black;
        font-size: 40px;
        text-align: center;
        line-height: 100px;
        font-weight: 500;
      }
    </style>
  </head>

  <body style="background-color: #171919; color: white">
    <div class="container">
      <div style="margin-bottom: 30px;">
        <span style="font-size: 80px; font-weight: 700;">Lets create something amazing!</span>
      </div>
      <div style="font-size: 40px;">
        Welcome to [justinsun's blog]! Before we get started, please confirm your email address with the following code.
      </div>
      <div class="button">
        ${code}
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
