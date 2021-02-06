import { Account } from '../entities/Account';
import { EntityManagerContext } from '../types';
import { Resolver, Query, Ctx, Mutation, Field, InputType, Arg } from 'type-graphql';
import argon2 from 'argon2';

@InputType()
class AccountInput {
    @Field()
    username: string;
    @Field()
    password: string;
}

@Resolver()
export class AccountResolver {
    @Query(() => [Account]) 
    accounts(@Ctx() { em }: EntityManagerContext): Promise<Account[]> {
        return em.find(Account, {});
    }

    @Mutation(() => Account)
    async register(
        @Arg('options') options: AccountInput,
        @Ctx() { em }: EntityManagerContext
    ) {
        const hashedPassword = await argon2.hash(options.password);
        const account = em.create(Account, { 
            username: options.username, 
            password: hashedPassword 
        });

        await em.persistAndFlush(account)
        return account;
    }
}