import { Variant } from 'src/product/entities/variant.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne, ManyToMany, JoinTable } from 'typeorm';

@Entity()
export class Color {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToMany(() => Variant, (variants) => variants.colors)
  @JoinTable({
    name: 'variant_color',
    joinColumn: { name: 'color_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'variant_id' },
  })
  variants: Variant[];
}