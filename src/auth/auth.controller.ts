import {
  ApiBasicAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Controller, Get, HttpCode, Session, UseGuards } from '@nestjs/common';
import { UserInfoResponseDto } from './dto/userinfo-response.dto';
import { AuthService } from './auth.service';
import { AccessRoles } from '../auth/decorators/metadata/access-roles.decorator';
import { AccessRole } from '../auth/constants/access-role.enum';
import { AuthGuard } from '../auth/guards/auth.guard';
import { PartnerGuard } from '../auth/guards/partner.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { BasicGuard } from '../auth/decorators/auth/basic-auth-guard.decorator';

@ApiTags('Auth introspect')
@UseGuards(BasicGuard)
@Controller({
  path: 'auth',
})
export class AuthController {
  constructor(private authService: AuthService) {}
  /*
  // unnecessary for Crusade/Nurture
  
  @Get('introspect')
  @HttpCode(200)
  @ApiTags('User info')
  @ApiOperation({
    summary: 'Return the current user information',
  })
  @ApiResponse({
    status: 200,
    description: 'Success.',
    type: UserInfoResponseDto,
  })
  authIntrospect(@Session() session): UserInfoResponseDto {
    const partnerId = session.claims?.partner;
    const role = session.claims?.signal_role;
    const name = `${session.claims?.firstName} ${session.claims?.lastName}`;
    const email = session.claims?.email;
    return {
      partnerId,
      role,
      name,
      email,
    };
  }
*/
  @Get('integrationHealthCheck')
  @HttpCode(200)
  integrationHealthCheck() {
    /*
  That API won’t have any logic, just add the auth guard to the API and make sure the creds are valid, or will throw 401 if invalid.
  The API for health check will invoke the above new API with the creds.
  For health check we need to make sure two things are in place:
  We are able to reach the service
  auth in place is working
  With the above strategy we will be able to do so
  */
    return {};
  }
}
