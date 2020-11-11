import { Router } from "express";
import UsersController from "@users/users/infra/http/controllers/UsersController";
import baselinesRouter from "@users/baselines/infra/http/routes/baselines.routes";
import diariesRouter from "@users/diaries/infra/http/routes/diaries.routes";
import tokensRouter from "@users/users/tokens/infra/http/routes/tokens.routes";
import KeycloakConfig from "@shared/keycloak/keycloak-config"
import csvRegister from "@users/csvRegister/api/routes/csvRegister.routes";
const usersRouter = Router();
const keycloak = KeycloakConfig.getKeycloak()

usersRouter.get('/', keycloak.protect("realm:admin"),UsersController.index);
usersRouter.get("/user/:id", keycloak.protect("realm:admin"),UsersController.getUserById)
usersRouter.get("/count", keycloak.protect("realm:admin"),UsersController.countUsers)
usersRouter.get("/paginated/:page", keycloak.protect("realm:admin"), UsersController.getUsersPaginated)
usersRouter.get("/username/:username", keycloak.protect("realm:admin"),UsersController.getUserByName)
usersRouter.get("/roles", keycloak.protect("realm:admin"), UsersController.indexRoles)
usersRouter.post('/addRole', keycloak.protect("realm:admin"), UsersController.addRoleForUser)
usersRouter.delete('/removeRole', keycloak.protect("realm:admin"), UsersController.removeRoleFromUser)
usersRouter.get('/roleUsers', keycloak.protect("realm:admin"), UsersController.usersFromRole)

usersRouter.use("/baselines", baselinesRouter);
usersRouter.use("/diaries", diariesRouter);
usersRouter.use("/csv", csvRegister);
usersRouter.use("/tokens", tokensRouter);

export default usersRouter;
