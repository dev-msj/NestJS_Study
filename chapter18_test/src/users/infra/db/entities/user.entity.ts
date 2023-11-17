import { Entity, PrimaryColumn, Column } from 'typeorm';
import { User } from '../../../domain/user';

@Entity('User')
export class UserEntity {
  @PrimaryColumn()
  uid: string;

  @Column({ length: 30 })
  name: string;

  @Column({ length: 60 })
  email: string;

  @Column({ length: 30 })
  password: string;

  @Column({ length: 60 })
  signupVerifyToken: string;

  toUserInfo() {
    return {
      uid: this.uid,
      name: this.name,
      email: this.email,
    };
  }
}
