"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.Account = void 0;
var core_1 = require("@mikro-orm/core");
var type_graphql_1 = require("type-graphql");
var Account = /** @class */ (function () {
    function Account() {
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
    __decorate([
        type_graphql_1.Field(function () { return type_graphql_1.Int; }),
        core_1.PrimaryKey()
    ], Account.prototype, "id");
    __decorate([
        type_graphql_1.Field(),
        core_1.Property({ length: 25, unique: true })
    ], Account.prototype, "username");
    __decorate([
        core_1.Property({ type: 'text' })
    ], Account.prototype, "password");
    __decorate([
        type_graphql_1.Field(),
        core_1.Property({ unique: true })
    ], Account.prototype, "email");
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        core_1.Property({ nullable: true })
    ], Account.prototype, "name");
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        core_1.Property({ nullable: true })
    ], Account.prototype, "bio");
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        core_1.Property({ nullable: true })
    ], Account.prototype, "favouriteTeam");
    __decorate([
        type_graphql_1.Field({ nullable: true }),
        core_1.Property({ nullable: true })
    ], Account.prototype, "avatarLocation");
    __decorate([
        type_graphql_1.Field(function () { return String; }),
        core_1.Property({ type: 'date' })
    ], Account.prototype, "createdAt");
    __decorate([
        type_graphql_1.Field(function () { return String; }),
        core_1.Property({ type: 'date', onUpdate: function () { return new Date(); } })
    ], Account.prototype, "updatedAt");
    Account = __decorate([
        type_graphql_1.ObjectType(),
        core_1.Entity()
    ], Account);
    return Account;
}());
exports.Account = Account;
