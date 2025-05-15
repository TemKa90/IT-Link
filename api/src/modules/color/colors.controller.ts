import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  ParseIntPipe,
  UsePipes,
  ValidationPipe,
  DefaultValuePipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ColorsService } from './colors.service';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { Color } from './entities/color.entity';

@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createColorDto: CreateColorDto): Promise<Color> {
    return this.colorsService.create(createColorDto);
  }

  @Get()
  async findPaginated(
    @Query('page') page: number = 1,
    @Query('pageSize') pageSize: number = 5,
    @Query('search') search?: string,
  ): Promise<Color[]> {
    page = Math.max(1, Number(page));
    pageSize = Math.max(1, Number(pageSize));
    const skip = (page - 1) * pageSize;

    return this.colorsService.findPaginated({
      skip,
      take: pageSize,
      search,
    });
  }

  @Get('all')
  async findAll(): Promise<Color[]> {
    return this.colorsService.findAll();
  }

  @Get('name/:name')
  findOneByName(@Param('name') name: string): Promise<Color> {
    return this.colorsService.findOneByName(name);
  }

  @Get(':id')
  findOneById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ): Promise<Color> {
    return this.colorsService.findOneById(id);
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
    @Body() updateColorDto: UpdateColorDto,
  ): Promise<Color> {
    return this.colorsService.update(id, updateColorDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  async remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.BAD_REQUEST }),
    )
    id: number,
  ): Promise<Color> {
    return this.colorsService.remove(id);
  }
}
