import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body } = request;

    return next.handle().pipe(
      map((response) => {
        // Filter out sensitive fields from the request body for logging
        const filteredRequestBody = this.filterSensitiveFields(body);
        console.log(
          '-------------------------------------------------------------------',
        );
        console.log(`Request Method: ${method}`);
        console.log(`Request URL: ${url}`);
        if (
          filteredRequestBody &&
          Object.keys(filteredRequestBody).length > 0
        ) {
          console.log(`Request Body: ${JSON.stringify(filteredRequestBody)}`);
        }
        // Filter out sensitive fields from the response for logging
        const filteredResponse = this.filterSensitiveFields(response);
        console.log(`Response: ${JSON.stringify(filteredResponse)}`);
        return response; // Return the actual response unmodified
      }),
      catchError((error) => {
        // Do not log anything if there is an error
        return throwError(error);
      }),
    );
  }

  private filterSensitiveFields(data: any): any {
    const blacklist = ['password', 'refreshToken', 'accessToken', 'otp'];

    if (data && typeof data === 'object' && !Array.isArray(data)) {
      return Object.keys(data).reduce((acc, key) => {
        if (blacklist.includes(key)) {
          acc[key] = '[FILTERED]';
        } else if (typeof data[key] === 'object' && data[key] !== null) {
          acc[key] = this.filterSensitiveFields(data[key]);
        } else {
          acc[key] = data[key];
        }
        return acc;
      }, {});
    } else if (Array.isArray(data)) {
      return data.map((item) => this.filterSensitiveFields(item));
    }

    return data;
  }
}
