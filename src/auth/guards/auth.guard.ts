import { AuthGuard } from "@nestjs/passport";

export class AuthGuards extends AuthGuard('jwt') {}