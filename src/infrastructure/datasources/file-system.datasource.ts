import { appendFileSync, existsSync, mkdirSync, writeFileSync } from "node:fs"

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
    getLogs(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
        throw new Error("Method not implemented.")
    }
}
