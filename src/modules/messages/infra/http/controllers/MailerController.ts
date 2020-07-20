import { Response, Request} from 'express'
import mailerConfigFactory from "@messages/factory/mailerConfigFactory";
import {container} from "tsyringe";
import getMailerConfig from "@messages/services/getMailerConfig";
import createMailerServiceFactory from "@messages/factory/createMailerServiceFactory";
import ListMailerService from "@messages/services/ListMailerService";

class MailerController {
  public async createOrUpdate(req: Request, res: Response){
    try{
      const {type} = req.body
      if(type == "ethereal" || type == "ses") {
        const mailerConfig = mailerConfigFactory(type, req.body)
        //@ts-ignore
        await mailerConfig.transporter.verify(async (error, success) => {
          if (success) {
            try {
              const createMailerService = container.resolve(createMailerServiceFactory(type))
              // @ts-ignore
              const mailer = await createMailerService.execute(req.body)
              await getMailerConfig()
              return res.status(200).json(mailer)
            }catch(e){
              return res.status(500).send("fields empty or wrong")
            }
          } else {
            return res.status(501).json(error)
          }
        })
      }else{
        return res.status(500).send("type undefined")
      }
    }catch(e){
      return res.status(e.status).json(e)
    }
  }

  public async getMail(req:Request, res: Response) {
    try{
      const listMailerService = container.resolve(ListMailerService)
      const mail = await listMailerService.execute()
      return res.status(200).json(mail)
    }catch(e){
      return res.status(e.status).json(e)
    }
  }
}
export default new MailerController()