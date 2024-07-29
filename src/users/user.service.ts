import { Injectable } from '@nestjs/common';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository } from 'typeorm';
import { UserFilterDto } from './dto/user-filter.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>  
    ){}

    async getAllUser(query: UserFilterDto){
        const items_per_page = query.items_per_page || 10;
        const page = Number(query.page) || 1;
        const skip = (page - 1) * items_per_page;
        const [res, total] = await this.userRepository.findAndCount({
            take: items_per_page,
            skip: skip,
            select:['id', 'firstName', 'lastName', 'email', 'isActive','createdAt','updatedAt', 'role', 'points'],
            where: {
                role: 'customer',
                ...(query.search && {
                    firstName: Like(`%${query.search}%`),
                    lastName: Like(`%${query.search}%`)
                })
            }
        });
        const last_page = Math.ceil(total/items_per_page);
        const prev_page = page - 1 < 1 ? null : page - 1;
        const next_page = page + 1 > last_page ? null : page + 1;
        return {
            total,
            data: res,
            prev_page,
            next_page,
            last_page
        } 
    }

    async getOneUser(id: number): Promise<User> { 
   
          
        return await this.userRepository.findOne({
            select:['id', 'firstName', 'lastName', 'email', 'isActive','createdAt','updatedAt', 'role', 'points'],
            where: {id}
        });
    }
}
