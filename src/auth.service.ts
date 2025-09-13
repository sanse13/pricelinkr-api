import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Model } from 'mongoose';
import { AuthDto } from './dto/auth.dto';
import { User, UserDocument } from './user.schema';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async register(authDto: AuthDto) {
    const hash = await bcrypt.hash(authDto.password, 10);
    const user = new this.userModel({
      email: authDto.email,
      password: hash,
    });
    await user.save();
    return user;
  }

  async login(authDto: AuthDto) {
    const user = await this.userModel.findOne({ email: authDto.email });
    if (!user) return null;
    const isMatch = await bcrypt.compare(authDto.password, user.password);
    if (!isMatch) return null;
    const payload = { sub: user._id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
