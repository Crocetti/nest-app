import { Body, Controller, Delete, Get, Param, Patch, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdatePutUserDto } from './dto/update-put-user.dto';
import { UpdatePatchUserDto } from './dto/update-patch-user.dto';
import { UserService } from './user.service';
import { Roles } from 'src/decorators/roles.decorator';
import { Role } from 'src/enum/role.enum';
import { RolesGuard } from 'src/guards/roles.guard';
import { AuthGuard } from 'src/guards/auth.guard';

@Roles(Role.Admin)
@UseGuards(AuthGuard, RolesGuard)
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() data: CreateUserDto) {
        return await this.userService.create(data);
    }

    @Get()
    async read() {
        return await this.userService.list();
    }

    @Get(':id')
    async readOne(@Param() params) {
        return this.userService.readOne(params.id);
    }

    @Put(':id')
    async update(@Param() params, @Body() data: UpdatePutUserDto) {
        return this.userService.update(params.id, data);
    }

    @Patch(':id')
    async updatePartial(@Param() param, @Body() data: UpdatePatchUserDto) {
        return this.userService.updatePartial(param.id, data);
    }

    @Delete(':id')
    /**
     * Deletes a user by their identifier
     * @param param The user identifier parameter
     * @returns An object containing the deletion result and the parameter
     */
    async delete(@Param('id') id: string) {
        return this.userService.delete(id);
    }
}
