import { LogRepository } from "../../../repository/log.repository"
import {
    LogEntity,
    LogEntityOptions,
    LogSeverityLevel
} from "../../entities/log.entity"

interface CheckServiceUseCase {
    execute(url: string): Promise<boolean>
}

type SuccessCallback = () => void | undefined
type ErrorCallback = (error: string) => void | undefined

export class CheckService implements CheckServiceUseCase {
    constructor(
        private readonly logRepository: LogRepository,
        private readonly successCallback: SuccessCallback,
        private readonly errorCallBack: ErrorCallback
    ) {}

    async execute(url: string): Promise<boolean> {
        try {
            const request = await fetch(url)
            if (!request.ok) throw new Error(`Error on check service ${url}`)

            const logEntityOptions: LogEntityOptions = {
                message: `Service ${url} working`,
                level: LogSeverityLevel.low,
                origin: "check-service.ts"
            }
            const log = new LogEntity(logEntityOptions)

            this.logRepository.saveLog(log)
            this.successCallback && this.successCallback()

            return true
        } catch (error) {
            const errorMessage = `${url} is not ok. ${error}`
            const logEntityOptions: LogEntityOptions = {
                message: errorMessage,
                level: LogSeverityLevel.high,
                origin: "check-service.ts"
            }
            const log = new LogEntity(logEntityOptions)
            this.logRepository.saveLog(log)
            this.errorCallBack && this.errorCallBack(errorMessage)

            return false
        }
    }
}
