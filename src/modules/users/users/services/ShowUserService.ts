import { inject, injectable } from "tsyringe";

import User from "@users/users/infra/typeorm/entities/User";
import AppError from "@errors/AppError";
import IUsersRepository from "@users/users/repositories/IUsersRepository";

@injectable()
class ShowUserService {
  constructor(
    @inject("UsersRepository")
    private usersRepository: IUsersRepository
  ) { }

  public async execute(id: string): Promise<User | undefined> {
    const user = await this.usersRepository.findById(id);

    if (!user) {
      throw new AppError("Usuário não encontrado", 404);
    }

    delete user.password;

    return user;
  }
}

export default ShowUserService;
