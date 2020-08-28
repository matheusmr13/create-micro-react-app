import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectLink1598386312520 implements MigrationInterface {
  name = 'ProjectLink1598386312520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "microfrontend" ADD "projectLink" character varying`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "microfrontend" DROP COLUMN "projectLink"`);
  }
}
