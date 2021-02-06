import { Account } from '../entities/Account';
import { EntityManagerContext } from '../types';
import { Resolver, Query, Ctx } from 'type-graphql';

@Resolver()
export class AccountResolver {
    @Query(() => [Account]) 
    accounts(@Ctx() { em }: EntityManagerContext): Promise<Account[]> {
        return em.find(Account, {});
    }
}