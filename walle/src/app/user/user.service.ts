import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './schema/user.schema';
import { DELTA_DISPATCH_DB_NAME } from 'src/common/constants/database.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name, DELTA_DISPATCH_DB_NAME)
    private readonly userModel: Model<UserDocument>,
  ) { }

  async findOneDni(dni: number): Promise<any> {
    return this.userModel.findOne({ user_dni: dni });
  }
}
