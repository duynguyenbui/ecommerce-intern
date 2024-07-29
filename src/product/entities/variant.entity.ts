import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn, ManyToMany, JoinTable } from 'typeorm';
import { Product } from './product.entity';
import { Thumbnail } from './thumbnail.entity';
import { OrderItem } from 'src/order/entities/orderItem.entity';
import { Size } from 'src/size/entities/size.entity';
import { Color } from 'src/color/entities/color.entity';

@Entity()
export class Variant {
  @PrimaryGeneratedColumn()
  id: number;
    
  @Column()
  SKU: string;

  @Column()
  images: string;

  @Column()
  price: number;

  @Column()
  stock_quantity: number;

  @Column()
  material: string;

  @Column({default: 0})
  discount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Thumbnail, (thumbnail) => thumbnail.variant)
  thumbnail?: Thumbnail[];

  @OneToMany(() => OrderItem, (orderItem) => orderItem.variant)
  orderItem?: OrderItem[];

  @ManyToOne(() => Product, (product) => product.variant)
  product?: Product
 
  @ManyToMany(() => Size, (sizes) => sizes.variants)
  @JoinTable({
    name: 'variant_size',
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'size_id' },
  })
  sizes: Size[];

  @ManyToMany(() => Color, (colors) => colors.variants)
  @JoinTable({
    name: 'variant_color',
    joinColumn: { name: 'variant_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'color_id' },
  })
  colors: Color[];
}