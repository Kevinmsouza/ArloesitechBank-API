import { MigrationInterface, QueryRunner } from "typeorm";

export class transactions1643273681458 implements MigrationInterface {
    name = "transactions1643273681458"

    public async up(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("CREATE TABLE \"transactions\" (\"id\" SERIAL NOT NULL, \"description\" character varying NOT NULL, \"value\" numeric(10,2) NOT NULL, \"createdAt\" TIMESTAMP NOT NULL DEFAULT now(), \"accountId\" integer NOT NULL, CONSTRAINT \"PK_a219afd8dd77ed80f5a862f1db9\" PRIMARY KEY (\"id\"))");
      await queryRunner.query("ALTER TABLE \"transactions\" ADD CONSTRAINT \"FK_26d8aec71ae9efbe468043cd2b9\" FOREIGN KEY (\"accountId\") REFERENCES \"accounts\"(\"id\") ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
      await queryRunner.query("ALTER TABLE \"transactions\" DROP CONSTRAINT \"FK_26d8aec71ae9efbe468043cd2b9\"");
      await queryRunner.query("DROP TABLE \"transactions\"");
    }
}
