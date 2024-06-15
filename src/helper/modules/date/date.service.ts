import { Injectable } from '@nestjs/common';
import * as moment from 'moment-timezone';
import { IDateService } from './date.interface';

@Injectable()
export class DateService implements IDateService {
  formatDate(date: string | Date, format: string): string {
    return moment.tz(date, '"Asia/Jakarta"').format(format);
  }
}
