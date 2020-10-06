import "dotenv/config";
import "reflect-metadata";
import express, { NextFunction, Response, Request } from "express";
import cors from 'cors'
import "express-async-errors";
import bodyParser from "body-parser";
import {string, ValidationError} from "yup";
import "module-alias/register";
import postgressConection from "../typeorm/ormconfig";
import "@shared/container/index";
import "@shared/container/providers/index";
import routes from "@routes/index";
import uploadConfig from "@config/upload";
import AppError from "@errors/AppError";
import { container } from "tsyringe";
import IQueueProvider from "@shared/container/providers/QueueProvider/models/IQueueProvider";
import KeycloakConnect from '@shared/keycloak/keycloak-config'
import { Job } from "agenda";
import MailerConfigSingleton from "@shared/container/providers/MailsProvider/singleton/MailerConfigSingleton";
import getMailerConfig from "@shared/container/providers/MailsProvider/services/getMailerConfig";
import getSmsConfig from "@shared/container/providers/SmsProvider/services/getSmsConfig";
import getMailerDestinataries from "@shared/container/providers/MailsProvider/services/getMailerDestinataries";
import MailerDestinatariesSingleton
  from "@shared/container/providers/MailsProvider/singleton/MailerDestinatariesSingleton";

class App {
  public express: express.Application;

  constructor() {
    this.express = express();
    const { FRONT_URL } = process.env
    this.middlewares();
    this.KeycloakConnect()
    this.routes();
    this.initPostgressAndServices()
  }

  async initPostgressAndServices(){
    await postgressConection()
    await Promise.all([
      this.initMailer(),
      this.initSms(),
      this.agenda(),
      this.errorHandling()
    ])
  }

  async initSms() {
    await getSmsConfig()
  }

  async initMailer(){
    await getMailerConfig()
    await getMailerDestinataries()
  }

  KeycloakConnect(){
    const keycloak = KeycloakConnect.getKeycloak()
    this.express.use(keycloak.middleware())
  }

  routes() {
    this.express.use(routes);
  }

  files() {
    this.express.use("/files", express.static(uploadConfig.directory));
  }

  middlewares() {
    this.express.use(cors())
    this.express.use(express.json());
    this.express.use(
      bodyParser.urlencoded({
        extended: true,
      })
    );
    this.express.use(bodyParser.json());
  }

  agenda() {
    const queue = container.resolve<IQueueProvider>("QueueProvider");
    const mailerConfigSingleton = MailerConfigSingleton
    const mailerDestinataries = MailerDestinatariesSingleton
    queue.listen().then(() => {
      queue.every("ScheduleJobsAt", "1 days");
    });
    if(mailerConfigSingleton.getIsActive())
      queue.getProvider().on('fail', (err: Error, job: Job) => {
        queue.runJob("SendMailJobError", {
          to: mailerDestinataries.getSuportIsActive() ? mailerDestinataries.getSuport() : "",
          from: mailerConfigSingleton.getConfig(),
          data: { name: err.name, message: err.message, job: job.attrs.name },
        })
      });

    //this.express.use("/admin/jobs", Agendash(queue.getProvider()));
  }

  errorHandling() {
    this.express.use(
      async (
        err: Error,
        request: Request,
        response: Response,
        next: NextFunction
      ) => {
        //const logger = container.resolve<ILoggerProvider>("LoggerProvider");

        if (err instanceof AppError) {
          //logger.error({ status: err.statusCode, message: err.message });
          return response.status(err.statusCode).json({
            status: "error",
            message: err.message,
          });
        }

        if (err instanceof ValidationError) {
          //logger.error({ status: 400, message: err.errors });
          return response.status(400).json({
            status: "error",
            message: err.errors,
          });
        }

        if (process.env.NODE_ENV !== "production") {
          //logger.error({ status: 500, message: err.message });
          return response.status(500).json({
            status: "error",
            message: err.message,
          });
        }

        const queue = container.resolve<IQueueProvider>("QueueProvider");
        const mailerConfigSingleton = MailerConfigSingleton
        const mailerDestinataries = MailerDestinatariesSingleton
        if(mailerConfigSingleton.getIsActive())
          queue.runJob("SendMailError", {
            to: mailerDestinataries.getSuportIsActive() ? mailerDestinataries.getSuport() : "",
            from: MailerConfigSingleton.getConfig(),
            data: { name: err.name, message: err.message },
          })

        //logger.error({ status: 500, message: err.message });
        return response.status(500).json({
          status: "error",
          message: "Erro interno do servidor"
        });
      }
    );
  }
}

export default new App().express;
