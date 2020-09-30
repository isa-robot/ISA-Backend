import {Request, Response} from 'express'
import {container} from "tsyringe";
import ListProtocolPendencyByNameByUserService from "@protocols/services/ListProtocolPendencyByNameByUserService";

class ProtocolController {
  public async listProtocolsPendent(req: Request, res: Response) {
    const {
      protocolName
    } = req.params
    // @ts-ignore
    const userId = req.user.id
    const listProtocolPendencyByNameByUser = container.resolve(ListProtocolPendencyByNameByUserService)
    const protocolsPendent = await listProtocolPendencyByNameByUser.execute({userId, protocolName})

    res.status(200).json(protocolsPendent)
  }
}

export default new ProtocolController()
