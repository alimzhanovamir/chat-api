import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService, UserType } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  async validateUser(email: string, password: string): Promise<Omit<UserType, "password"> | null> {
    console.log('validateUser');
    const user: UserType = await this.userService.findUserByEmail(email);
    
    if (user && user.password === password) {
      const { password, ...result } = user;
      return result;
    }

    return null;
  }

  async login(user: UserType) {
    const payload = { username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    }
  }
}
