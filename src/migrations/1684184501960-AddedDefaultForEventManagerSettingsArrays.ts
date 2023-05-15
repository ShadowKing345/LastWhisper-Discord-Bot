import { MigrationInterface, QueryRunner } from "typeorm";

export class AddedDefaultForEventManagerSettingsArrays1684184501960 implements MigrationInterface {
    name = 'AddedDefaultForEventManagerSettingsArrays1684184501960'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ALTER COLUMN "delimiterCharacters" SET DEFAULT '{[,]}'`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ALTER COLUMN "exclusionList" SET DEFAULT '{}'`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ALTER COLUMN "dateTimeFormat" SET DEFAULT '{}'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ALTER COLUMN "dateTimeFormat" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ALTER COLUMN "exclusionList" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ALTER COLUMN "delimiterCharacters" DROP DEFAULT`);
    }

}
