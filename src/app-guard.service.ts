import { APP_GUARD } from "@nestjs/core";
import { JwtGuard } from "./common/guards";

export const AppGuardService = {
  provide: APP_GUARD,
  useClass: JwtGuard,
};
