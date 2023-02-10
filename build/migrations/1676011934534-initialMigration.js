export class initialMigration1676011934534 {
    name = 'initialMigration1676011934534';
    async up(queryRunner) {
        await queryRunner.query(`CREATE TABLE "manager_utils_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "loggingChannel" character varying, "clearChannelBlacklist" text array NOT NULL, CONSTRAINT "PK_27d44e06482c145c7e70b86adfc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "role_manager_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "acceptedRoleId" character varying, "reactionMessageIds" text array NOT NULL, "reactionListeningChannel" character varying, CONSTRAINT "PK_a61d2466799adfb1b65419b31ad" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buff_manager_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "channelId" character varying, "hour" character varying, "dow" integer, "buffMessage" character varying, "weekMessage" character varying, CONSTRAINT "PK_ee0f212f1a2ebe7f56eaa9a1769" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "buff" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "text" character varying NOT NULL, "imageUrl" character varying NOT NULL, CONSTRAINT "PK_67d070a141ee65f5c8ed5526435" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "days" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "monday_id" uuid, "tuesday_id" uuid, "wednesday_id" uuid, "thursday_id" uuid, "friday_id" uuid, "saturday_id" uuid, "sunday_id" uuid, CONSTRAINT "REL_efe4819f52b151e44767d0d9f8" UNIQUE ("monday_id"), CONSTRAINT "REL_cbe6b549849d0cb54557fa77be" UNIQUE ("tuesday_id"), CONSTRAINT "REL_6572eecad9d0f58768854981da" UNIQUE ("wednesday_id"), CONSTRAINT "REL_620a1407d539bcbc500ff6d3d4" UNIQUE ("thursday_id"), CONSTRAINT "REL_ee3477cb755696ec9a41b14e74" UNIQUE ("friday_id"), CONSTRAINT "REL_144a7a9b2858c24dd35f17062f" UNIQUE ("saturday_id"), CONSTRAINT "REL_2d1724c416bc61b8a7f0dbf25f" UNIQUE ("sunday_id"), CONSTRAINT "PK_c2c66eb46534bea34ba48cc4d7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "week" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "isEnabled" boolean NOT NULL, "title" character varying NOT NULL, "days_id" uuid, CONSTRAINT "REL_65fd7c01f43e4828d0401b9c34" UNIQUE ("days_id"), CONSTRAINT "PK_1f85dfadd5f363a1d0bce2b9664" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_manager_settings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "listenerChannelId" character varying, "postingChannelId" character varying, "delimiterCharacters" character array NOT NULL, "announcement" character varying, "description" character varying, "dateTime" character varying, "exclusionList" character array NOT NULL, "dateTimeFormat" text array NOT NULL, CONSTRAINT "PK_c42b58b392e8fc39f258b0da75e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "plot" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying, "description" character varying, "config_id" uuid, CONSTRAINT "PK_7c22bdc3280a3a5610c63159883" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "gardening_module_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "messagePostingChannelId" character varying, CONSTRAINT "PK_f1b962c3c0dce72b897b86aa2bc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "permission_manager_config" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, CONSTRAINT "PK_db2ae6fde4dc55ef27ef28130f7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."permission_mode_enum" AS ENUM('0', '1')`);
        await queryRunner.query(`CREATE TABLE "permission" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "key" character varying NOT NULL, "roles" text array NOT NULL, "mode" "public"."permission_mode_enum" NOT NULL DEFAULT '0', "blackList" boolean NOT NULL, "config_id" uuid, CONSTRAINT "PK_3b8b97af9d9d8807e41e6f48362" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_object" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "messageId" character varying, "name" character varying NOT NULL, "description" character varying NOT NULL, "dateTime" integer NOT NULL, "additional" text array NOT NULL, CONSTRAINT "PK_795921f20b6d9d82510e8d5da21" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "event_reminder" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "guildId" character varying NOT NULL, "message" character varying NOT NULL, "timeDelta" character varying NOT NULL, CONSTRAINT "PK_4f47c638b8b0d753b62e56ee850" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_efe4819f52b151e44767d0d9f86" FOREIGN KEY ("monday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_cbe6b549849d0cb54557fa77be6" FOREIGN KEY ("tuesday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_6572eecad9d0f58768854981da9" FOREIGN KEY ("wednesday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_620a1407d539bcbc500ff6d3d49" FOREIGN KEY ("thursday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_ee3477cb755696ec9a41b14e74a" FOREIGN KEY ("friday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_144a7a9b2858c24dd35f17062f8" FOREIGN KEY ("saturday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "days" ADD CONSTRAINT "FK_2d1724c416bc61b8a7f0dbf25f6" FOREIGN KEY ("sunday_id") REFERENCES "buff"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "week" ADD CONSTRAINT "FK_65fd7c01f43e4828d0401b9c349" FOREIGN KEY ("days_id") REFERENCES "days"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "plot" ADD CONSTRAINT "FK_915be621b510e1a973ed14a74fa" FOREIGN KEY ("config_id") REFERENCES "gardening_module_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "permission" ADD CONSTRAINT "FK_ee91330ab36b064e9e611f47585" FOREIGN KEY ("config_id") REFERENCES "permission_manager_config"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }
    async down(queryRunner) {
        await queryRunner.query(`ALTER TABLE "permission" DROP CONSTRAINT "FK_ee91330ab36b064e9e611f47585"`);
        await queryRunner.query(`ALTER TABLE "plot" DROP CONSTRAINT "FK_915be621b510e1a973ed14a74fa"`);
        await queryRunner.query(`ALTER TABLE "week" DROP CONSTRAINT "FK_65fd7c01f43e4828d0401b9c349"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_2d1724c416bc61b8a7f0dbf25f6"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_144a7a9b2858c24dd35f17062f8"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_ee3477cb755696ec9a41b14e74a"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_620a1407d539bcbc500ff6d3d49"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_6572eecad9d0f58768854981da9"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_cbe6b549849d0cb54557fa77be6"`);
        await queryRunner.query(`ALTER TABLE "days" DROP CONSTRAINT "FK_efe4819f52b151e44767d0d9f86"`);
        await queryRunner.query(`DROP TABLE "event_reminder"`);
        await queryRunner.query(`DROP TABLE "event_object"`);
        await queryRunner.query(`DROP TABLE "permission"`);
        await queryRunner.query(`DROP TYPE "public"."permission_mode_enum"`);
        await queryRunner.query(`DROP TABLE "permission_manager_config"`);
        await queryRunner.query(`DROP TABLE "gardening_module_config"`);
        await queryRunner.query(`DROP TABLE "plot"`);
        await queryRunner.query(`DROP TABLE "event_manager_settings"`);
        await queryRunner.query(`DROP TABLE "week"`);
        await queryRunner.query(`DROP TABLE "days"`);
        await queryRunner.query(`DROP TABLE "buff"`);
        await queryRunner.query(`DROP TABLE "buff_manager_settings"`);
        await queryRunner.query(`DROP TABLE "role_manager_config"`);
        await queryRunner.query(`DROP TABLE "manager_utils_config"`);
    }
}
//# sourceMappingURL=1676011934534-initialMigration.js.map