import { Exclude } from 'class-transformer';
import { CreateDateColumn, PrimaryColumn, UpdateDateColumn } from 'typeorm';

import { AbstractDto } from '../dtos';
import { Constructor } from '../../../../../common/src/util/types';

export abstract class AbstractEntity<
  T extends AbstractDto = AbstractDto,
  O = never,
> {
  @PrimaryColumn({
    type: 'uuid',
    generated: 'uuid',
  })
  @Exclude()
  public uuid: string;

  @CreateDateColumn({ type: 'timestamp' })
  @Exclude()
  public createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  @Exclude()
  public updatedAt: Date;

  private dtoClass: Constructor<T, [AbstractEntity, O?]>;

  toDto(options?: O): T {
    const dtoClass = this.dtoClass;

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new this.dtoClass(this, options);
  }
}
