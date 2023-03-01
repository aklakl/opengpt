export enum AccessRole {
  Admin = 'admin',
  PartnerAdmin = 'partnerAdmin',
}
//Due to case sensitive, depend on okta token's role. our code doesn't have case sensitive compatible. so just make the enum follow the okta token's role value. by 20220804 ming
