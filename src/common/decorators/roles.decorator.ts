import { SetMetadata } from "@nestjs/common";
import { UserTypes } from "../types/user-types.enum";

export const Roles = (...roles: UserTypes[]) => SetMetadata("roles", roles);
