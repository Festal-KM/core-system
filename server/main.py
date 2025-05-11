from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
import smtplib
from email.message import EmailMessage
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication
import tempfile
import os
from datetime import datetime
from dotenv import load_dotenv
from email.header import Header

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Invoice(BaseModel):
    id: str
    date: str
    client: str
    department: Optional[str] = None
    amount: int
    tax: int
    total: int
    due: str
    issuer: str
    issuerDept: Optional[str] = None
    issuerTel: Optional[str] = None
    issuerMail: Optional[str] = None
    bank: Optional[str] = None
    note: Optional[str] = None
    fileUrl: Optional[str] = None
    mailTo: Optional[str] = None  # 追加: 送信先メールアドレス
    mailTanto: Optional[str] = None  # 追加: 担当者名

class EmailRequest(BaseModel):
    to: str
    subject: str
    body: str
    pdf_path: str = None

@app.post("/api/invoices")
async def create_invoice(invoice: Invoice):
    # --- PDF生成ダミー（テキストファイルで代用） ---
    with tempfile.NamedTemporaryFile(delete=False, suffix='.pdf') as tmp:
        tmp.write(f"請求書: {invoice.client}\n金額: {invoice.total}\n発行日: {invoice.date}".encode('utf-8'))
        pdf_path = tmp.name

    # --- メール送信 ---
    smtp_host = 'smtp.gmail.com'
    smtp_port = 587
    smtp_user = os.environ.get('SMTP_USER', 'your_gmail@gmail.com')  # ←本番は環境変数で
    smtp_pass = os.environ.get('SMTP_PASS', 'your_gmail_app_password')
    mail_to = invoice.mailTo or smtp_user
    mail_tanto = invoice.mailTanto or 'ご担当者様'
    # 件名を「202X年X月度御請求書」に自動生成
    try:
        dt = datetime.strptime(invoice.date, "%Y-%m-%d")
        subject = f"{dt.year}年{dt.month}月度御請求書"
    except Exception:
        subject = "御請求書"
    # 本文も自動生成
    body = f'''株式会社{invoice.client}\n経理ご担当者様\n\nお世話になっております。\n表題の通り、御請求書を本メールに添付いたしますのでご確認よろしくお願いいたします。\nご不明な点がありましたら、担当{mail_tanto}までご連絡ください。\n\n引き続きよろしくお願いいたします。'''
    msg = EmailMessage()
    msg['Subject'] = subject
    msg['From'] = smtp_user
    msg['To'] = mail_to
    msg.set_content(body)
    with open(pdf_path, 'rb') as f:
        msg.add_attachment(f.read(), maintype='application', subtype='pdf', filename='invoice.pdf')
    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
        os.remove(pdf_path)
        return {"mailStatus": "success", "message": "メール送信完了（PDF添付）"}
    except Exception as e:
        if os.path.exists(pdf_path):
            os.remove(pdf_path)
        return {"mailStatus": "error", "message": f"メール送信失敗: {str(e)}"}

@app.post("/api/send-email")
async def send_email(request: EmailRequest):
    try:
        # Outlook SMTP設定
        smtp_server = "smtp.office365.com"
        smtp_port = 587
        sender_email = os.getenv("OUTLOOK_EMAIL")
        sender_password = os.getenv("OUTLOOK_PASSWORD")

        if not sender_email or not sender_password:
            raise HTTPException(status_code=500, detail="SMTP認証情報が設定されていません")

        # メール作成
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = request.to
        msg["Subject"] = str(Header(request.subject, 'utf-8'))  # 件名をUTF-8でエンコード
        msg.attach(MIMEText(request.body, "plain", "utf-8"))  # 本文もUTF-8

        # PDF添付（存在する場合）
        if request.pdf_path and os.path.exists(request.pdf_path):
            with open(request.pdf_path, "rb") as f:
                pdf = MIMEApplication(f.read(), _subtype="pdf")
                filename = str(Header(os.path.basename(request.pdf_path), 'utf-8'))
                pdf.add_header("Content-Disposition", "attachment", filename=filename)
                msg.attach(pdf)

        # SMTPサーバーに接続して送信
        with smtplib.SMTP(smtp_server, smtp_port) as server:
            server.starttls()
            server.login(sender_email, sender_password)
            server.send_message(msg)

        return {"message": "メール送信が完了しました"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"メール送信に失敗しました: {str(e)}") 