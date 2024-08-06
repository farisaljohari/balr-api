import { Injectable } from '@nestjs/common';
import * as qs from 'qs';
import * as crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
@Injectable()
export class AuthenticationService {
  private token: string;
  private deviceId: string;
  private accessKey: string;
  private secretKey: string;

  constructor(private readonly configService: ConfigService) {
    (this.deviceId = this.configService.get<string>('auth-config.DEVICE_ID')),
      (this.accessKey = this.configService.get<string>(
        'auth-config.ACCESS_KEY',
      )),
      (this.secretKey = this.configService.get<string>(
        'auth-config.SECRET_KEY',
      ));
  }

  async main() {
    await this.getToken();
    const data = await this.getDeviceInfo(this.deviceId);
    console.log('fetch success: ', JSON.stringify(data));
    return JSON.stringify(data);
  }

  async getToken() {
    const method = 'GET';
    const timestamp = Date.now().toString();
    const signUrl = 'https://openapi.tuyaeu.com/v1.0/token?grant_type=1';
    const contentHash = crypto.createHash('sha256').update('').digest('hex');
    const stringToSign = [method, contentHash, '', signUrl].join('\n');
    const signStr = this.accessKey + timestamp + stringToSign;

    const headers = {
      t: timestamp,
      sign_method: 'HMAC-SHA256',
      client_id: this.accessKey,
      sign: await this.encryptStr(signStr, this.secretKey),
    };

    const { data: login } = await axios.get(
      'https://openapi.tuyaeu.com/v1.0/token',
      {
        params: {
          grant_type: 1,
        },
        headers,
      },
    );

    if (!login || !login.success) {
      throw new Error(`fetch failed: ${login.msg}`);
    }
    this.token = login.result.access_token;
  }

  async getDeviceInfo(deviceId: string) {
    const query = {};
    const method = 'POST';
    const url = `https://openapi.tuyaeu.com/v1.0/devices/${deviceId}/commands`;
    const reqHeaders: { [k: string]: string } = await this.getRequestSign(
      url,
      method,
      {},
      query,
    );

    const { data } = await axios.post(url, {}, reqHeaders);

    if (!data || !data.success) {
      throw new Error(`request api failed: ${data.msg}`);
    }

    return data;
  }

  async encryptStr(str: string, secret: string): Promise<string> {
    return crypto
      .createHmac('sha256', secret)
      .update(str, 'utf8')
      .digest('hex')
      .toUpperCase();
  }

  async getRequestSign(
    path: string,
    method: string,
    query: { [k: string]: any } = {},
    body: { [k: string]: any } = {},
  ) {
    const t = Date.now().toString();
    const [uri, pathQuery] = path.split('?');
    const queryMerged = Object.assign(query, qs.parse(pathQuery));
    const sortedQuery: { [k: string]: string } = {};
    Object.keys(queryMerged)
      .sort()
      .forEach((i) => (sortedQuery[i] = query[i]));

    const querystring = decodeURIComponent(qs.stringify(sortedQuery));
    const url = querystring ? `${uri}?${querystring}` : uri;
    const contentHash = crypto
      .createHash('sha256')
      .update(JSON.stringify(body))
      .digest('hex');
    const stringToSign = [method, contentHash, '', url].join('\n');
    const signStr = this.accessKey + this.token + t + stringToSign;
    return {
      t,
      path: url,
      client_id: 'this.accessKey',
      sign: await this.encryptStr(signStr, this.secretKey),
      sign_method: 'HMAC-SHA256',
      access_token: this.token,
    };
  }
}
