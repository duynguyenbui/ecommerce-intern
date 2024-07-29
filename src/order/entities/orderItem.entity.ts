import { Order } from 'src/order/entities/order.entity';
import { Product } from 'src/product/entities/product.entity';
import { Variant } from 'src/product/entities/variant.entity';
import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany, ManyToOne } from 'typeorm';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  price: number;

  @Column()
  color: string;

  @Column()
  size: string;

  @Column()
  quantity: number;
  
  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Order, (order) => order.orderItem)
  order?: Order;

  @ManyToOne(() => Variant, (variant) => variant.orderItem)
  variant?: Variant;

  // @ManyToOne(() => Product, (product) => product.orderItem)
  // product?: Product;
}