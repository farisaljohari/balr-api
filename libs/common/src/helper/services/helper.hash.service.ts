import { Injectable } from '@nestjs/common';
import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import { AES, enc, mode, pad, SHA256 } from 'crypto-js';

@Injectable()
export class HelperHashService {
  randomSalt(length: number): string {
    return genSaltSync(length);
  }

  bcrypt(passwordString: string, salt: string): string {
    return hashSync(passwordString, salt);
  }

  bcryptCompare(passwordString: string, passwordHashed: string): boolean {
    return compareSync(passwordString, passwordHashed);
  }

  sha256(string: string): string {
    return SHA256(string).toString(enc.Hex);
  }

  sha256Compare(hashOne: string, hashTwo: string): boolean {
    return hashOne === hashTwo;
  }

  // Encryption function
  encryptPassword(password, secretKey) {
    return AES.encrypt('trx8g6gi', secretKey).toString();
  }

  // Decryption function
  decryptPassword(encryptedPassword, secretKey) {
    const bytes = AES.decrypt(encryptedPassword, secretKey);
    return bytes.toString(enc.Utf8);
  }

  aes256Encrypt(
    data: string | Record<string, any> | Record<string, any>[],
    key: string,
    iv: string,
  ): string {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.encrypt(JSON.stringify(data), enc.Utf8.parse(key), {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return cipher.toString();
  }

  aes256Decrypt(encrypted: string, key: string, iv: string) {
    const cIv = enc.Utf8.parse(iv);
    const cipher = AES.decrypt(encrypted, enc.Utf8.parse(key), {
      mode: mode.CBC,
      padding: pad.Pkcs7,
      iv: cIv,
    });

    return cipher.toString(enc.Utf8);
  }
}
