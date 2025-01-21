import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

//Nest recommends we create an actual guard instead of just passing AuthGuard('strategy') to @UseGuards()
@Injectable()
export class LocalGuard extends AuthGuard('local') {}
