import { MigrationInterface, QueryRunner } from "typeorm";

export class accounts1643189622166 implements MigrationInterface {
    name = "accounts1643189622166"

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("CREATE TABLE \"accounts\" (\"id\" SERIAL NOT NULL, \"number\" character varying NOT NULL, \"agency\" character varying NOT NULL, \"balance\" numeric(10,2) NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"userId\" integer NOT NULL, CONSTRAINT \"PK_5a7a02c20412299d198e097a8fe\" PRIMARY KEY (\"id\"))");
      await queryRunner.query("ALTER TABLE \"accounts\" ADD CONSTRAINT \"FK_3aa23c0a6d107393e8b40e3e2a6\" FOREIGN KEY (\"userId\") REFERENCES \"users\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("ALTER TABLE \"accounts\" DROP CONSTRAINT \"FK_3aa23c0a6d107393e8b40e3e2a6\"");
      await queryRunner.query("DROP TABLE \"accounts\"");
    }
}
