import { BadRequestException, PipeTransform } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { InterfaceUser } from '../schemas/models/user.interface';

export class EncryptPasswordPipe implements PipeTransform {
  constructor() {}

  async transform(body: InterfaceUser) {
    const { password, ...userData } = body;
    try {
      const hashedPassword = await hash(password, 8);
      return { password: hashedPassword, ...userData };
    } catch (err) {
      throw new BadRequestException('Password format invalid');
    }
  }
}
