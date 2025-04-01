import { IsOptional } from "class-validator"

export class SuccessResponseDto<T> {
  @IsOptional()
  finalizado: boolean

  @IsOptional()
  mensaje: string

  @IsOptional()
  datos: T
}
