import {MigrationInterface, QueryRunner} from "typeorm";

export class Initial1596139327650 implements MigrationInterface {
    name = 'Initial1596139327650'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" character varying NOT NULL, "githubToken" character varying NOT NULL, "slackToken" character varying NOT NULL, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "version" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "createdAt" character varying NOT NULL, "microfrontendId" character varying NOT NULL, "sha" character varying NOT NULL, "path" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_4fb5fbb15a43da9f35493107b1d" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "microfrontend" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ownerId" character varying NOT NULL, "createdAt" character varying NOT NULL, "packageName" character varying NOT NULL, "integrationType" character varying, "originId" character varying, "applicationId" character varying NOT NULL, "approvalType" character varying NOT NULL, "type" character varying NOT NULL, CONSTRAINT "PK_7a5b9f984737f28b20d8bf54bc0" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "deploy" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ownerId" character varying NOT NULL, "createdAt" character varying NOT NULL, "versions" text NOT NULL, "applicationId" character varying NOT NULL, "namespaceId" character varying NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_e515d996a39c08335939905ca2b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "namespace" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ownerId" character varying NOT NULL, "createdAt" character varying NOT NULL, "path" character varying NOT NULL, "applicationId" character varying NOT NULL, "isMain" boolean NOT NULL, "currentDeployId" character varying NOT NULL, "nextDeployId" character varying NOT NULL, CONSTRAINT "PK_155557f16b1d166388d7308086a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "application" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "ownerId" character varying NOT NULL, "createdAt" character varying NOT NULL, "integrationType" character varying, "destinationId" character varying, "slackChannelId" character varying, CONSTRAINT "PK_569e0c3e863ebdf5f2408ee1670" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "destination" ("id" uuid NOT NULL, "type" character varying NOT NULL, "config" text NOT NULL, CONSTRAINT "PK_e45b5ee5788eb3c7f0ae41746e7" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "destination"`);
        await queryRunner.query(`DROP TABLE "application"`);
        await queryRunner.query(`DROP TABLE "namespace"`);
        await queryRunner.query(`DROP TABLE "deploy"`);
        await queryRunner.query(`DROP TABLE "microfrontend"`);
        await queryRunner.query(`DROP TABLE "version"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
