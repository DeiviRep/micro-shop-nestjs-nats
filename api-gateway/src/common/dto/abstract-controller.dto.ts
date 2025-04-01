import { BadRequestException } from '@nestjs/common'
import { Messages } from '../constants/response-messages'
import { SuccessResponseDto } from './success-response.dto'


type ListaCantidadType<T> = [Array<T>, number]

export abstract class AbstractController {
  makeResponse<T>(data: T, message: string): SuccessResponseDto<T> {
    return {
      finalizado: true,
      mensaje: message,
      datos: data,
    }
  }

  success<T>(
    data: T,
    message = Messages.SUCCESS_DEFAULT
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successList<T>(
    data: T,
    message = Messages.SUCCESS_LIST
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  successCreate<T>(
    data: T,
    message = Messages.SUCCESS_CREATE
  ): SuccessResponseDto<T> {
    return this.makeResponse(data, message)
  }

  getUser(req) {
    if (req?.user?.id) {
      return req.user.id
    }
    throw new BadRequestException(
      `Es necesario que esté autenticado para consumir este recurso.`
    )
  }
}
