import { Migration } from '@mikro-orm/migrations';

export class Migration20210205233123 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table "account" ("id" serial primary key, "username" varchar(25) not null, "password" varchar(255) not null, "name" varchar(255) null);');
    this.addSql('alter table "account" add constraint "account_username_unique" unique ("username");');

    this.addSql('drop table if exists "user" cascade;');
  }

}
