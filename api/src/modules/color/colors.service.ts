import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  constructor(
    @InjectRepository(Color)
    private colorsRepository: Repository<Color>,
  ) {}

  async create(createColorDto: CreateColorDto): Promise<Color> {
    const existingColorByName = await this.colorsRepository.findOne({
      where: { c_name: ILike(createColorDto.c_name) },
    });
    if (existingColorByName) {
      throw new ConflictException(
        `Цвет с именем "${createColorDto.c_name}" уже существует.`,
      );
    }

    const existingColorByHex = await this.colorsRepository.findOne({
      where: { c_hex: createColorDto.c_hex.toUpperCase() },
    });
    if (existingColorByHex) {
      throw new ConflictException(
        `Цвет с HEX-кодом "${createColorDto.c_hex}" уже существует.`,
      );
    }

    const newColor = this.colorsRepository.create({
      ...createColorDto,
      c_hex: createColorDto.c_hex.toUpperCase(),
    });
    return this.colorsRepository.save(newColor);
  }

  async findAll(): Promise<Color[]> {
    return this.colorsRepository.find({ order: { id: 'ASC' } });
  }

  async findPaginated(options: {
    skip: number;
    take: number;
    search?: string;
  }): Promise<Color[]> {
    const query = this.colorsRepository
      .createQueryBuilder('color')
      .orderBy('color.id', 'ASC')
      .skip(options.skip)
      .take(options.take);

    if (options.search) {
      query.where('color.c_name LIKE :search', {
        search: `%${options.search}%`,
      });
    }

    return query.getMany();
  }

  async findOneById(id: number): Promise<Color> {
    const color = await this.colorsRepository.findOneBy({ id });
    if (!color) {
      throw new NotFoundException(`Цвет с ID "${id}" не найден.`);
    }
    return color;
  }

  async findOneByName(name: string): Promise<Color> {
    const color = await this.colorsRepository.findOne({
      where: { c_name: ILike(name) },
    });
    if (!color) {
      throw new NotFoundException(`Цвет с названием "${name}" не найден.`);
    }
    return color;
  }

  async update(id: number, updateColorDto: UpdateColorDto): Promise<Color> {
    const color = await this.findOneById(id);

    if (
      updateColorDto.c_name &&
      updateColorDto.c_name.toLowerCase() !== color.c_name.toLowerCase()
    ) {
      const existingColorByName = await this.colorsRepository.findOne({
        where: { c_name: ILike(updateColorDto.c_name), id: Not(id) },
      });
      if (existingColorByName) {
        throw new ConflictException(
          `Цвет с именем "${updateColorDto.c_name}" уже существует.`,
        );
      }
    }

    if (
      updateColorDto.c_hex &&
      updateColorDto.c_hex.toUpperCase() !== color.c_hex.toUpperCase()
    ) {
      const existingColorByHex = await this.colorsRepository.findOne({
        where: { c_hex: updateColorDto.c_hex.toUpperCase(), id: Not(id) },
      });
      if (existingColorByHex) {
        throw new ConflictException(
          `Цвет с HEX-кодом "${updateColorDto.c_hex}" уже существует.`,
        );
      }
    }

    const updateData: Partial<Color> = {};
    if (updateColorDto.c_name !== undefined)
      updateData.c_name = updateColorDto.c_name;
    if (updateColorDto.c_hex !== undefined)
      updateData.c_hex = updateColorDto.c_hex.toUpperCase();
    if (updateColorDto.c_rgb !== undefined)
      updateData.c_rgb = updateColorDto.c_rgb;

    if (Object.keys(updateData).length === 0) {
      return color;
    }

    await this.colorsRepository.update(id, updateData);
    return this.findOneById(id);
  }

  async remove(id: number): Promise<Color> {
    const color = await this.findOneById(id);
    await this.colorsRepository.delete(id);
    return color;
  }
}
