import { IsString, IsNotEmpty, IsOptional, IsEmail, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateUserDto {
	@IsOptional()
	@IsNumber()
	@Type(() => Number)
	id_user?: number;

	@IsEmail({}, { message: 'Email must be a valid email address.' })
	@IsNotEmpty({ message: 'Email cannot be empty.' })
	email: string;

	@IsString({ message: 'Password must be a string.' })
	@IsNotEmpty({ message: 'Password cannot be empty.' })
	password: string;

	@IsString({ message: 'Name must be a string.' })
	@IsNotEmpty({ message: 'Name cannot be empty.' })
	name: string;

	@IsString({ message: 'Account number must be a string.' })
	@IsNotEmpty({ message: 'Account number cannot be empty.' })
	account_number: string;

	@IsOptional()
	@IsString()
	role?: string;
}
