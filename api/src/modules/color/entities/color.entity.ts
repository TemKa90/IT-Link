import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('v_color')
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, name: 'c_name' })
  c_name: string;

  @Column({ length: 7, name: 'c_hex' })
  c_hex: string;

  @Column({ length: 50, name: 'c_rgb' })
  c_rgb: string;
}
