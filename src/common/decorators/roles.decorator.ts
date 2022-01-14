import { SetMetadata } from "@nestjs/common";
import { UserTypes } from "../interfaces/user-types";

export const Roles = (...roles: UserTypes[]) => SetMetadata("roles", roles);
