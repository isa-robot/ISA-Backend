import { inject, injectable } from "tsyringe";
import ICfpngRepository from "../repositories/ICfpngRepository";
import Cfpng from "../infra/typeorm/entities/Cfpng";
import AppError from "@shared/errors/AppError";

@injectable()
class ListCfpngByProtocolIdService {
  constructor(
    @inject("CfpngRepository")
    private cfpngRepository: ICfpngRepository
  ) { }

  public async execute(id: string): Promise<Cfpng | any> {
    const cfpng = await this.cfpngRepository.findByProtocolId(id);

    return cfpng;
  }
}

export default ListCfpngByProtocolIdService;
