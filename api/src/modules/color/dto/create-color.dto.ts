import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class CreateColorDto {
  @IsNotEmpty({ message: 'Название цвета (c_name) не должно быть пустым' })
  @IsString()
  @Length(1, 100)
  c_name: string;

  @IsNotEmpty({ message: 'HEX-код цвета (c_hex) не должен быть пустым' })
  @IsString()
  @Length(7, 7, { message: 'HEX-код должен состоять из 7 символов (например, #RRGGBB)' })
  @Matches(/^#[0-9A-Fa-f]{6}$/, {
    message: 'HEX-код должен быть в формате #RRGGBB',
  })
  c_hex: string;

  @IsNotEmpty({ message: 'RGB-код цвета (c_rgb) не должен быть пустым' })
  @IsString()
  @Length(10, 50)
  @Matches(/^rgb\(\s*\d{1,3}\s*,\s*\d{1,3}\s*,\s*\d{1,3}\s*\)$/, {
    message: 'RGB-код должен быть в формате rgb(r, g, b)',
  })
  c_rgb: string;
}