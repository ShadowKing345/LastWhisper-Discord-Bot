export class ChangedExlusionListToBeTextArray1676188159735 {
    name = 'ChangedExlusionListToBeTextArray1676188159735';
    async up(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event_manager_settings" DROP COLUMN "exclusionList"`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ADD "exclusionList" text array NOT NULL`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "event_manager_settings" DROP COLUMN "exclusionList"`);
        await queryRunner.query(`ALTER TABLE "event_manager_settings" ADD "exclusionList" character array NOT NULL`);
    }
}
//# sourceMappingURL=1676188159735-ChangedExlusionListToBeTextArray.js.map