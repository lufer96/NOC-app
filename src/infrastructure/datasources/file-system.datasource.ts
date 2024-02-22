import {
    appendFileSync,
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync
} from "node:fs"

import { LogDatasource } from "../../domain/datasources/log.datasource"
import { LogEntity, LogSeverityLevel } from "../../domain/entities/log.entity"

export class FileSystemDatasource implements LogDatasource {
    private readonly logPath = "logs/"
    private readonly allLogsPath = "logs/logs-all.log"
    private readonly mediumLogsPath = "logs/logs-medium.log"
    private readonly highLogsPath = "logs/logs-high.log"

    constructor() {
        this.createLogsFiles()
    }

    private createLogsFiles = () => {
        if (!existsSync(this.logPath)) {
            mkdirSync(this.logPath)
        }

        ;[this.allLogsPath, this.mediumLogsPath, this.highLogsPath].forEach(
            (path) => {
                if (!existsSync(path)) {
                    writeFileSync(path, "")
                }
            }
        )
    }

    async saveLog(newLog: LogEntity): Promise<void> {
        const logAsJson = `${JSON.stringify(newLog)} \n`
        appendFileSync(this.allLogsPath, logAsJson)

        if (newLog.level === LogSeverityLevel.low) return

        if (newLog.level === LogSeverityLevel.medium)
            return appendFileSync(this.mediumLogsPath, logAsJson)

        if (newLog.level === LogSeverityLevel.high)
            return appendFileSync(this.highLogsPath, logAsJson)
    }

    private getLogsFromFile = async (
        logsPath: string
    ): Promise<LogEntity[]> => {
        const fileContent = readFileSync(logsPath, {
            encoding: "utf-8"
        })
        if(fileContent === '') return []
        
        const logs = fileContent
            .split("\n")
            .map((log) => LogEntity.fromJson(log))

        return logs
    }

    async getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        let logsPath

        if (severityLevel === LogSeverityLevel.low) logsPath = this.allLogsPath
        if (severityLevel === LogSeverityLevel.medium)
            logsPath = this.mediumLogsPath
        if (severityLevel === LogSeverityLevel.high)
            logsPath = this.highLogsPath

        if (!logsPath) throw new Error(`${severityLevel} not implemented`)

        return await this.getLogsFromFile(logsPath)
    }
}
