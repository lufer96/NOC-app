import nodemailer from "nodemailer"
import { envs } from "../../config/plugins/envs.plugin"

interface SendEmailOptions {
    to: string | string[]
    subject: string
    htmlBody: string
    attachments?: Attachment[]
}

interface Attachment {
    filename: string
    path: string
}

export class EmailService {
    private transporter = nodemailer.createTransport({
        service: envs.MAILER_SERVICE,
        auth: {
            user: envs.MAILER_EMAIL,
            pass: envs.MAILER_SECRET_KEY
        }
    })

    async sendEmail(options: SendEmailOptions): Promise<boolean> {
        const { to, subject, htmlBody, attachments = [] } = options
        try {
            const sentInformation = await this.transporter.sendMail({
                to,
                subject,
                html: htmlBody,
                attachments
            })

            console.log({ sentInformation })

            return true
        } catch (error) {
            return false
        }
    }

    async sendEmailWithFileSystemLogs(to: string | string[]) {
        const subject = "Logs for server"
        const htmlBody = `
                <h2>Logs de sistema - NOC</h2>
                <P>Luis villamizar</P>
                <p>Ver logs adjuntos</p>
            `
        const attachments: Attachment[] = [
            {
                filename: "logs-all.log",
                path: "./logs/logs-all.log"
            },
            {
                filename: "logs-high.log",
                path: "./logs/logs-high.log"
            },
            {
                filename: "logs-medium.log",
                path: "./logs/logs-medium.log"
            }
        ]

        return this.sendEmail({ to, subject, attachments, htmlBody })
    }
}
