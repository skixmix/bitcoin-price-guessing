import { Controller, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../guards/authentication.guard';

@Controller('score')
@ApiTags('scoring')
@UseGuards(JwtAuthGuard)
export class ScoreController {}
