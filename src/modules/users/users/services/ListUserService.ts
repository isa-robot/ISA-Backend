import { inject, injectable } from 'tsyringe';

import User from '@users/users/infra/typeorm/entities/User';
import IUsersRepository from '@users/users/repositories/IUsersRepository';

@injectable()
class ListUserService {
    constructor(
        @inject('UsersRepository')
        private usersRepository: IUsersRepository,
    ) { }

    public async execute(): Promise<User[]> {
        const users = await this.usersRepository.findAll();

        users.map((user) => delete user.password);

        return users;
    }
}

export default ListUserService;
