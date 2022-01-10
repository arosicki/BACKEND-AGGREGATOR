import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { SignInLocalDto, SignUpLocalDto } from "./dto";
import { User } from "./entities/user.entity";

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>
  ) {}
  async signUpLocal(_signUpLocalDto: SignUpLocalDto) {
    this.userRepository; // prevent unused vars ts err
  }
  async signInLocal(_signInLocalDto: SignInLocalDto) {}
  async logout() {}
  async refreshToken() {}
}
