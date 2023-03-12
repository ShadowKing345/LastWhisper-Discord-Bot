import { MigrationInterface, QueryRunner } from "typeorm";

export class ManyToOneChange1676076810914 implements MigrationInterface {
    name = 'ManyToOneChange1676076810914'

    public async up( queryRunner: QueryRunner ): Promise<void> {
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_efe4819f52b151e44767d0d9f86"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_cbe6b549849d0cb54557fa77be6"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_6572eecad9d0f58768854981da9"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_620a1407d539bcbc500ff6d3d49"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_ee3477cb755696ec9a41b14e74a"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_144a7a9b2858c24dd35f17062f8"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_2d1724c416bc61b8a7f0dbf25f6"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_efe4819f52b151e44767d0d9f8"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_cbe6b549849d0cb54557fa77be"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_6572eecad9d0f58768854981da"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_620a1407d539bcbc500ff6d3d4"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_ee3477cb755696ec9a41b14e74"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_144a7a9b2858c24dd35f17062f"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "REL_2d1724c416bc61b8a7f0dbf25f"` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_efe4819f52b151e44767d0d9f86" FOREIGN KEY ("monday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_cbe6b549849d0cb54557fa77be6" FOREIGN KEY ("tuesday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_6572eecad9d0f58768854981da9" FOREIGN KEY ("wednesday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_620a1407d539bcbc500ff6d3d49" FOREIGN KEY ("thursday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_ee3477cb755696ec9a41b14e74a" FOREIGN KEY ("friday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_144a7a9b2858c24dd35f17062f8" FOREIGN KEY ("saturday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_2d1724c416bc61b8a7f0dbf25f6" FOREIGN KEY ("sunday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
    }

    public async down( queryRunner: QueryRunner ): Promise<void> {
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_2d1724c416bc61b8a7f0dbf25f6"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_144a7a9b2858c24dd35f17062f8"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_ee3477cb755696ec9a41b14e74a"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_620a1407d539bcbc500ff6d3d49"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_6572eecad9d0f58768854981da9"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_cbe6b549849d0cb54557fa77be6"` );
        await queryRunner.query( `ALTER TABLE "days" DROP CONSTRAINT "FK_efe4819f52b151e44767d0d9f86"` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_2d1724c416bc61b8a7f0dbf25f" UNIQUE ("sunday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_144a7a9b2858c24dd35f17062f" UNIQUE ("saturday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_ee3477cb755696ec9a41b14e74" UNIQUE ("friday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_620a1407d539bcbc500ff6d3d4" UNIQUE ("thursday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_6572eecad9d0f58768854981da" UNIQUE ("wednesday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_cbe6b549849d0cb54557fa77be" UNIQUE ("tuesday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "REL_efe4819f52b151e44767d0d9f8" UNIQUE ("monday_id")` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_2d1724c416bc61b8a7f0dbf25f6" FOREIGN KEY ("sunday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_144a7a9b2858c24dd35f17062f8" FOREIGN KEY ("saturday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_ee3477cb755696ec9a41b14e74a" FOREIGN KEY ("friday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_620a1407d539bcbc500ff6d3d49" FOREIGN KEY ("thursday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_6572eecad9d0f58768854981da9" FOREIGN KEY ("wednesday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_cbe6b549849d0cb54557fa77be6" FOREIGN KEY ("tuesday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
        await queryRunner.query( `ALTER TABLE "days" ADD CONSTRAINT "FK_efe4819f52b151e44767d0d9f86" FOREIGN KEY ("monday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION` );
    }

}
