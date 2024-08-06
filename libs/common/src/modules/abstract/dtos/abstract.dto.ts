import { ApiProperty } from '@nestjs/swagger';
import { AbstractEntity } from '../entities/abstract.entity';

export class AbstractDto {
  @ApiProperty({ format: 'uuid' })
  readonly uuid: string;

  constructor(abstract: AbstractEntity, options?: { excludeFields?: boolean }) {
    if (!options?.excludeFields) {
      this.uuid = abstract.uuid;
    }
  }
}
