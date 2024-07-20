import { compare } from 'bcrypt';
import { Exclude } from 'class-transformer';
import { IsEmail, IsOptional, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { AuditEntity } from '@/audit-log/audit-log.decorator';

const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const STRONG_PASSWORD_MESSAGE = 'must contain an uppercase letter, a lowercase letter and a symbol';

@Entity('credentials')
@AuditEntity()
export class Credential extends BaseEntity {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ unique: true })
  @IsEmail()
  email: string;

  @Column({ select: false })
  @Exclude()
  passwordDigest: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Exclude()
  @Matches(STRONG_PASSWORD_REGEX, { message: key => `${key.property} ${STRONG_PASSWORD_MESSAGE}` })
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  password?: string;

  @Exclude()
  @Matches(STRONG_PASSWORD_REGEX, { message: key => `${key.property} ${STRONG_PASSWORD_MESSAGE}` })
  @IsString()
  @MinLength(8)
  @MaxLength(24)
  @IsOptional()
  passwordConfirmation?: string;

  async authenticate(password: string) {
    if (!this.passwordDigest) {
      const { passwordDigest } = await (this.constructor as typeof Credential).findOneOrFail({
        where: { id: this.id },
        select: ['passwordDigest'],
      });

      this.passwordDigest = passwordDigest;
    }

    return await compare(password, this.passwordDigest);
  }
}
