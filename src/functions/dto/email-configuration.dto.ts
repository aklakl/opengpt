import * as crusadeDto from '../dto/crusade';
import { PartnerConfigurationLogo } from '../entities/partner.configuration.logo.entity';
import { deserializeArray } from '../util/commonUtils';

export class Logo {
  url: string;
  name?: string;
  format?: string;
  width?: string;
  height?: string;
  size?: number;
  createDate?: string;
  isDefault?: boolean;
}

export class Branding {
  logos: Logo[];
  colorPrimary: string;
  colorSecondary: string;
  companyName: string;

  constructor(configuration: PartnerConfigurationLogo) {
    if (configuration.logo) {
      this.logos = deserializeArray(Logo, configuration.logo);
    }
    if (!!configuration.colorPrimary) {
      this.colorPrimary = configuration.colorPrimary;
    }
    if (!!configuration.colorSecondary) {
      this.colorSecondary = configuration.colorSecondary;
    }
    if (!!configuration.companyName) {
      this.companyName = configuration.companyName;
    }
  }
}

export class ReplyToAddress {
  fromDisplayName: string;
  isDefault?: boolean;
}

export enum ConfigurationItemEnum {
  DOMAIN_IP_POOL = 'DOMAIN_IP_POOL',
  DISPLAY_NAME_ADDRESS = 'email.displayNameAddress',
  REPLY_TO_ADDRESS = 'email.replyToAddress',
  LOGO = 'email.logo',
  COLOR_PRIMARY = 'email.colorPrimary',
  COLOR_SECONDARY = 'email.colorSecondary',
  INTRODUCTION = 'email.introduction',
  FOOTER = 'email.footer',
}

//for input request
export class EmailConfigurationAllRequestDto {
  partnerId: string;
  branding: Branding;
  displayNameAddresses: crusadeDto.DisplayNameAddressesDto[];
  replyToAddresses: ReplyToAddress[];
  enforceFromOrReplyTo?: boolean;
  customFooter: crusadeDto.CustomFooterDto;
  setPlaintextFooter?: boolean;
  introduction: string;
}

//for result respond (could be different from EmailConfigurationAllRequestDto)
export class EmailConfigurationAllResponseDto extends EmailConfigurationAllRequestDto {}
