import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { RegisterUserDto } from './dto/register-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    private async hashPassword(password: string): Promise<string> {
        const saltOrRounds = 10;
        const salt = await bcrypt.genSalt(saltOrRounds);
        const hash = await bcrypt.hash(password, salt);
        return hash;
    }

    private async generateToken(payload: {id: number, email: string, role: string}): Promise<string> {
        const access_token = await this.jwtService.signAsync(payload)
        return access_token;
    }

    async register(registerUserDto: RegisterUserDto):Promise<User> {
        const checkUser = await this.usersRepository.findOne({ where: {email: registerUserDto.email}});
        if(checkUser) {
            throw new HttpException("user already exists", HttpStatus.CONFLICT);
        }
        const newPassword = await this.hashPassword(registerUserDto.password);
        return await this.usersRepository.save({...registerUserDto, password: newPassword});
    }

    async login(loginUserDto: LoginUserDto): Promise<string> {
        const user = await this.usersRepository.findOne(
            {
                where:{email: loginUserDto.email}
            }
        );
        if(!user) {
            throw new HttpException("User or password is incorrect", HttpStatus.UNAUTHORIZED);
        };
        const checkPassword = bcrypt.compareSync(loginUserDto.password, user.password);
        
        if(!checkPassword) {
            throw new HttpException("User or password is incorrect", HttpStatus.UNAUTHORIZED);
        };
        const payload = {id: user.id, email: user.email, role: user.role};
        return this.generateToken(payload);
    }
}
