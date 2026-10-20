import { Type } from 'class-transformer';
import {
  Equals,
  IsBoolean,
  IsDefined,
  IsNumber,
  IsObject,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  ValidateIf,
  ValidateNested,
} from 'class-validator';

export class CablewayCoordinatesDto {
  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-90)
  @Max(90)
  latitude!: number;

  @IsDefined()
  @IsNumber({ maxDecimalPlaces: 6 })
  @Min(-180)
  @Max(180)
  longitude!: number;
}

export class CreateCablewayRequestDto {
  @IsString()
  @Matches(/\S/u)
  @MaxLength(160)
  contactName!: string;

  @IsString()
  @Matches(/\S/u)
  @MaxLength(320)
  contactInfo!: string;

  @IsString()
  @Matches(/\S/u)
  @MaxLength(5000)
  installationContext!: string;

  @IsString()
  @Matches(/\S/u)
  @MaxLength(2000)
  locationDescription!: string;

  @ValidateIf((_, value: unknown) => value !== undefined)
  @IsObject()
  @ValidateNested()
  @Type(() => CablewayCoordinatesDto)
  coordinates?: CablewayCoordinatesDto;

  @IsBoolean()
  @Equals(true)
  consent!: boolean;
}
