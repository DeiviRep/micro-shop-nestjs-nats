import { BadRequestException } from '@nestjs/common'

export abstract class AbstractController {
  getUser(req) {
    if (req?.user?.userId) {
      return req.user.userId
    }
    throw new BadRequestException(
      `Es necesario que esté autenticado para consumir este recurso.`
    )
  }
}
