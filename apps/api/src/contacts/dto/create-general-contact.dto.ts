import {
  Equals,
  IsBoolean,
  IsString,
  Matches,
  MaxLength,
} from 'class-validator';

export class CreateGeneralContactDto {
  @IsString()
  @Matches(/\S/u)
  @MaxLength(160)
  name!: string;

  @IsString()
  @Matches(/\S/u)
  @MaxLength(320)
  contactInfo!: string;

  @IsString()
  @Matches(/\S/u)
  @MaxLength(200)
  subject!: string;

  @IsString()
  @Matches(/\S/u)
  @MaxLength(5000)
  message!: string;

  @IsBoolean()
  @Equals(true)
  consent!: boolean;
}
