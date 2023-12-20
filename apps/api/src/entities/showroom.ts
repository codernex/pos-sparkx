import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import Customer from "./customer";
import Invoice from "./invoice";
import Employee from "./employee";
import Purchase from "./purchase";

@Entity()
export default class Showroom extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  showroomName: string;

  @Column()
  showroomCode: string;

  @Column({ nullable: true })
  showroomMobile: string;

  @Column()
  showroomAddress: string;

  @OneToMany(() => Customer, (cm) => cm.showroom, {
    cascade: true,
    eager: true,
  })
  customer: Customer[];

  @OneToMany(() => Invoice, (invoice) => invoice.showroom, {
    eager: true,
    cascade: true,
  })
  invoices: Invoice[];

  @OneToMany(() => Employee, (emp) => emp.showroom, {
    eager: true,
    cascade: true,
  })
  employees: Employee[];

  @ManyToMany(() => Purchase, (p) => p.showroom)
  @JoinTable()
  purchases: Purchase[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  addCustomer(customer: Customer) {
    if (this.customer == null) {
      this.customer = new Array<Customer>();
    }
    this.customer.push(customer);
  }
}
