import { DateTime, Duration } from "luxon";
import { MigrationInterface, QueryRunner } from "typeorm";
import { EventReminder } from "../entities/eventManager/index.js";

export class ChangedTimeDeltaType1683914490007 implements MigrationInterface {
    name = 'ChangedTimeDeltaType1683914490007'

    public async up(queryRunner: QueryRunner): Promise<void> {
        const repo = queryRunner.manager.getRepository<EventReminder>(EventReminder);
        
        const array = (await repo.find({})).map((item: object) => {
            const dateTime = DateTime.fromFormat(item['timeDelta'] as string, 'HH:mm');
            item['timeDelta'] = DateTime.fromSeconds(0).plus({hour: dateTime.hour, minute: dateTime.minute}).toUnixInteger();
            
            return item;
        });
        await repo.createQueryBuilder().delete().where('true').execute();
        
        await queryRunner.query(`ALTER TABLE "event_reminder" DROP COLUMN "timeDelta"`);
        await queryRunner.query(`ALTER TABLE "event_reminder" ADD "timeDelta" integer NOT NULL`);
        
        await repo.save(array);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const repo = queryRunner.manager.getRepository<EventReminder>(EventReminder);

        const array = (await repo.find({})).map((item: object) => {
            item['timeDelta'] = Duration.fromObject({seconds: item['timeDelta'] as number} ).toFormat( 'hh:mm' );
            return item;
        });
        await repo.createQueryBuilder().delete().where('true').execute();
        
        await queryRunner.query(`ALTER TABLE "event_reminder" DROP COLUMN "timeDelta"`);
        await queryRunner.query(`ALTER TABLE "event_reminder" ADD "timeDelta" character varying NOT NULL`);

        await repo.save(array);
    }

}
