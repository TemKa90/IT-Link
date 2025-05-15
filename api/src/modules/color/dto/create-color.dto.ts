import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiPropertyOptional } from "@nestjs/swagger";

export class CreateColorDto {
  @ApiPropertyOptional({
    description: 'Название цвета',
    example: 'Red',
  })
  @IsNotEmpty({ message: 'Название цвета (c_name) не должно быть пустым' })
  @IsString()
  c_name: string;

  @ApiPropertyOptional({
    description: 'HEX-код цвета',
    minLength: 7,
    maxLength: 7,
    example: '#FF0000',
  })
  @IsNotEmpty({ message: 'HEX-код цвета (c_hex) не должен быть пустым' })
  @IsString()
  @Length(7, 7, { message: 'HEX-код должен состоять из 7 символов (например, #RRGGBB)' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'HEX-код должен быть в формате #RRGGBB',
  })
  c_hex: string;

  @ApiPropertyOptional({
    description: 'RGB-код цвета',
    example: 'rgb(255, 0, 0)',
  })
  @IsNotEmpty({ message: 'RGB-код цвета (c_rgb) не должен быть пустым' })
  @IsString()
  @Matches(/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/, {
    message: 'RGB-код должен быть в формате rgb(r, g, b)',
  })
  c_rgb: string;
}