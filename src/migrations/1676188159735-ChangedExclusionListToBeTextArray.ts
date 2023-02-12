import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangedExclusionListToBeTextArray1676188159735 implements MigrationInterface {
    name = 'ChangedExclusionListToBeTextArray1676188159735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_manager_settings" DROP COLUMN "exclusionList"`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ADD "exclusionList" text array NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_manager_settings" DROP COLUMN "exclusionList"`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ADD "exclusionList" character array NOT NULL`);
    }

}
