import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegistrarDto {
  @IsString({ message: 'Informe o nome' })
  nome!: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @IsString({ message: 'Informe a senha' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha!: string;
}

export class LoginDto {
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @IsString({ message: 'Informe a senha' })
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha!: string;
}
