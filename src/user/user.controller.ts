import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';

@Controller('users')
export class UserController {
  @Post()
  async createUser(@Body() {name, email, password}: CreateUserDto) {
    return { name, email, password };
  }

  @Get()
  async read() {
    return { users: [] };
  }

  @Get(':id')
  async readOne(@Param() params) {
    return { user: {}, params };
  }

  @Put(':id')
  async update(@Param() params, @Body() {name, email, password}: UpdatePutUserDto) {
    return {
      method: 'PUT',
      name, email, password,
      params,
    };
  }

  @Patch(':id')
  async updatePartial(
    @Param() param,
    @Body() { name, email, password }: UpdatePatchUserDto,
  ) {
    return {
      method: 'PATCH',
      name, email, password,
      param,
    };
  }

  @Delete(':id')
  /**
   * Deletes a user by their identifier
   * @param param The user identifier parameter
   * @returns An object containing the deletion result and the parameter
   */
  async delete(@Param('id', ParseIntPipe) id: number) {
    return {
      result: 'Registro apagado',
      id,
    };
  }
}
