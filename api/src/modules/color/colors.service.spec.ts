import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, ILike, Not } from 'typeorm';
import { ColorsService } from './colors.service';
import { Color } from './entities/color.entity';
import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { NotFoundException, ConflictException } from '@nestjs/common';

const mockColorRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  findAndCount: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ColorsService', () => {
  let service: ColorsService;
  let repository: ReturnType<typeof mockColorRepository>;

  const mockColor: Color = {
    id: 1,
    c_name: 'Test Red',
    c_hex: '#FF0000',
    c_rgb: 'rgb(255, 0, 0)',
  };

  const mockColor2: Color = {
    id: 2,
    c_name: 'Test Blue',
    c_hex: '#0000FF',
    c_rgb: 'rgb(0, 0, 255)',
  };

  const colorsArray = [mockColor, mockColor2];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ColorsService,
        {
          provide: getRepositoryToken(Color),
          useFactory: mockColorRepository,
        },
      ],
    }).compile();

    service = module.get<ColorsService>(ColorsService);
    repository = module.get(getRepositoryToken(Color));

    jest.clearAllMocks();
  });

  it('должен быть определен', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const createColorDto: CreateColorDto = {
      c_name: 'New Color',
      c_hex: '#N3WC0L',
      c_rgb: 'rgb(1,2,3)',
    };
    const expectedCreatedColor = { id: 3, ...createColorDto, c_hex: createColorDto.c_hex.toUpperCase() };

    it('должен успешно создать цвет', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(expectedCreatedColor as any);
      repository.save.mockResolvedValue(expectedCreatedColor);

      const result = await service.create(createColorDto);
      expect(result).toEqual(expectedCreatedColor);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { c_name: ILike(createColorDto.c_name) } });
      expect(repository.findOne).toHaveBeenCalledWith({ where: { c_hex: createColorDto.c_hex.toUpperCase() } });
      expect(repository.create).toHaveBeenCalledWith({ ...createColorDto, c_hex: createColorDto.c_hex.toUpperCase() });
      expect(repository.save).toHaveBeenCalledWith(expectedCreatedColor);
    });

    it('должен выбросить ConflictException, если имя цвета уже существует', async () => {
      repository.findOne.mockResolvedValueOnce(mockColor);
      await expect(service.create(createColorDto)).rejects.toThrow(
        new ConflictException(`Цвет с именем "${createColorDto.c_name}" уже существует.`)
      );
    });

    it('должен выбросить ConflictException, если HEX-код цвета уже существует', async () => {
      repository.findOne.mockResolvedValueOnce(null);
      repository.findOne.mockResolvedValueOnce(mockColor);
      await expect(service.create(createColorDto)).rejects.toThrow(
        new ConflictException(`Цвет с HEX-кодом "${createColorDto.c_hex}" уже существует.`)
      );
    });
  });

  describe('findAll', () => {
    it('должен вернуть массив цветов, отсортированных по ID ASC', async () => {
      repository.find.mockResolvedValue(colorsArray);
      expect(await service.findAll()).toEqual(colorsArray);
      expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });
    });
  });

  describe('findAllPaginated', () => {
    it('должен вернуть постраничный список цветов', async () => {
      const page = 1;
      const limit = 1;
      const total = colorsArray.length;
      const paginatedResult = { data: [mockColor], total, currentPage: page, totalPages: Math.ceil(total/limit) };
      repository.findAndCount.mockResolvedValue([[mockColor], total]);

      const result = await service.findAllPaginated(page, limit);
      expect(result).toEqual(paginatedResult);
      expect(repository.findAndCount).toHaveBeenCalledWith({
        skip: (page - 1) * limit,
        take: limit,
        order: { id: 'ASC' }
      });
    });
  });

  describe('findOneById', () => {
    it('должен вернуть один цвет по ID', async () => {
      repository.findOneBy.mockResolvedValue(mockColor);
      expect(await service.findOneById(1)).toEqual(mockColor);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
    });

    it('должен выбросить NotFoundException, если цвет с ID не найден', async () => {
      repository.findOneBy.mockResolvedValue(null);
      await expect(service.findOneById(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('findOneByName', () => {
    it('должен вернуть один цвет по имени (без учета регистра)', async () => {
      repository.findOne.mockResolvedValue(mockColor);
      const name = 'Test Red';
      expect(await service.findOneByName(name)).toEqual(mockColor);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { c_name: ILike(name) } });
    });

    it('должен выбросить NotFoundException, если цвет с именем не найден', async () => {
      repository.findOne.mockResolvedValue(null);
      await expect(service.findOneByName('NonExistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    const updateDto: UpdateColorDto = { c_name: 'Updated Red' };
    const existingColor = { ...mockColor };
    const updatedColorEntity = { ...existingColor, c_name: 'Updated Red' };

    it('должен обновить цвет', async () => {
      repository.findOneBy.mockResolvedValueOnce(existingColor);
      repository.findOne.mockResolvedValue(null);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOneBy.mockResolvedValueOnce(updatedColorEntity);

      const result = await service.update(1, updateDto);

      expect(repository.findOneBy).toHaveBeenCalledWith({id: 1});
      expect(repository.update).toHaveBeenCalledWith(1, { c_name: updateDto.c_name });
      expect(result).toEqual(updatedColorEntity);
    });

    it('должен обновить только предоставленные поля (например, только hex)', async () => {
      const updateHexDto: UpdateColorDto = { c_hex: '#NEW HEX' };
      const updatedWithHexEntity = { ...existingColor, c_hex: '#NEW HEX' };
      repository.findOneBy.mockResolvedValueOnce(existingColor);
      repository.findOne.mockResolvedValue(null);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOneBy.mockResolvedValueOnce(updatedWithHexEntity);

      const result = await service.update(1, updateHexDto);
      expect(repository.update).toHaveBeenCalledWith(1, { c_hex: updateHexDto.c_hex.toUpperCase() });
      expect(result).toEqual(updatedWithHexEntity);
    });

    it('должен выбросить NotFoundException, если цвет для обновления не найден', async () => {
      repository.findOneBy.mockResolvedValue(null);
      await expect(service.update(99, updateDto)).rejects.toThrow(NotFoundException);
    });

    it('должен выбросить ConflictException, если обновленное имя уже существует для другого цвета', async () => {
      const conflictingColor = { ...mockColor2, c_name: 'Updated Red' };
      repository.findOneBy.mockResolvedValue(existingColor);
      repository.findOne.mockResolvedValue(conflictingColor);

      await expect(service.update(1, { c_name: 'Updated Red' })).rejects.toThrow(ConflictException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { c_name: ILike('Updated Red'), id: Not(1) } });
    });

    it('не должен выбросить ConflictException, если обновленное имя совпадает, но для того же ID цвета', async () => {
      const noChangeDto: UpdateColorDto = { c_name: 'Test Red' };
      repository.findOneBy.mockResolvedValueOnce(existingColor);
      repository.findOne.mockResolvedValue(null);
      repository.update.mockResolvedValue({ affected: 1 } as any);
      repository.findOneBy.mockResolvedValueOnce(existingColor);

      const result = await service.update(1, noChangeDto);
      expect(result).toEqual(existingColor);
    });
  });

  describe('remove', () => {
    it('должен удалить цвет и вернуть его', async () => {
      repository.findOneBy.mockResolvedValue(mockColor);
      repository.delete.mockResolvedValue({ affected: 1, raw: [] });

      expect(await service.remove(1)).toEqual(mockColor);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('должен выбросить NotFoundException, если цвет для удаления не найден', async () => {
      repository.findOneBy.mockResolvedValue(null);
      await expect(service.remove(99)).rejects.toThrow(NotFoundException);
    });
  });

  describe('Полный сценарий: Добавление -> Список -> Удаление', () => {
    const newColorDto: CreateColorDto = {
      c_name: 'Scenario Green',
      c_hex: '#00FF00',
      c_rgb: 'rgb(0,255,0)',
    };
    const createdColor: Color = { id: 10, ...newColorDto, c_hex: newColorDto.c_hex.toUpperCase() };

    it('должен успешно выполнить сценарий добавления-списка-удаления', async () => {
      repository.findOne.mockResolvedValue(null);
      repository.create.mockReturnValue(createdColor as any);
      repository.save.mockResolvedValue(createdColor);
      const addedColor = await service.create(newColorDto);
      expect(addedColor).toEqual(createdColor);

      repository.find.mockResolvedValue([addedColor, ...colorsArray].sort((a,b) => a.id - b.id));
      const allColors = await service.findAll();
      expect(allColors).toContainEqual(addedColor);
      expect(repository.find).toHaveBeenCalledWith({ order: { id: 'ASC' } });

      repository.findOneBy.mockResolvedValue(addedColor);
      repository.delete.mockResolvedValue({ affected: 1, raw: [] });
      const removedColor = await service.remove(addedColor.id);
      expect(removedColor).toEqual(addedColor);
    });
  });
});
