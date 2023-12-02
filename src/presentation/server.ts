import { CronService } from './cron/cron-service'

export class ServerApp {
  public static start() {
    console.log('Server starter...')

    CronService.createJob(
      '*/5 * * * * *',
      () => {
        const date = new Date()
        console.log('5 Seconds', date);
        
      }
    )
  }
}
