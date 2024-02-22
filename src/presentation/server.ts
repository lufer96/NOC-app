import { LogSeverityLevel } from "../domain/entities/log.entity"
import { CheckService } from "../domain/use-cases/checks/check-service"
import { SendEmailLagos } from "../domain/use-cases/email/send-email-logs"
import { FileSystemDatasource } from "../infrastructure/datasources/file-system.datasource"
import { MongoLogDatasource } from "../infrastructure/datasources/mongo-log.datasource"
import { LogRepositoryImpl } from "../infrastructure/repositories/log.repository.impl"
import { CronService } from "./cron/cron-service"
import { EmailService } from "./email/email.service"

const logRepository = new LogRepositoryImpl(new FileSystemDatasource())
// const logRepository = new LogRepositoryImpl(new MongoLogDatasource())
const emailService = new EmailService()
export class ServerApp {
    public static async start() {
        console.log("Server starter... :)")
        // new SendEmailLagos(emailService, logRepository).execute(
        //     "luis-fernando-villa@hotmail.com"
        // )
        // const emailService = new EmailService()
        // emailService.sendEmailWithFileSystemLogs('luis-fernando-villa@hotmail.com')
        // emailService.sendEmail({
        //     to: 'luis-fernando-villa@hotmail.com',
        //     subject: 'NOC-app test',
        //     htmlBody: `
        //         <h2>Logs de sistema - NOC</h2>
        //         <P>Luis villamizar</P>
        //         <p>Ver logs adjuntos</p>
        //     `
        // })

        // CronService.createJob("*/5 * * * * *", () => {
        //     const url = "https://google.com"
        //     // new CheckService(
        //     //     logRepository,
        //     //     () => console.log(`${url} is ok`),
        //     //     (error) => console.log(error)
        //     // ).execute(url)
        //     new CheckService(
        //         logRepository,
        //         () => console.log("success"),
        //         (error) => console.log(error)
        //     ).execute("http://localhost:3000/posts")
        // })

        const logs = await logRepository.getLogs(LogSeverityLevel.low)
        console.log({ logs })
    }
}
