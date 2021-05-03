import { ObjectType, Field } from 'type-graphql';
import CLUB_PROFILES from '../../clubProfiles.json';

@ObjectType({ description: 'Collection of social media profiles for a club or player.' })
export class SocialMedia {
    constructor(clubShortName: string) {
        if (CLUB_PROFILES[clubShortName as keyof typeof CLUB_PROFILES]) {
            const clubProfiles = CLUB_PROFILES[clubShortName as keyof typeof CLUB_PROFILES];
            const defaultHandle = clubProfiles.defaultHandle;
    
            this.facebook = defaultHandle;
            this.instagram = defaultHandle;
            this.twitter = defaultHandle;
            this.youtube = defaultHandle;
            this.tiktok = defaultHandle;
    
            const exceptionProfiles = clubProfiles.except || {};
    
            for (let p in exceptionProfiles) {
                let exceptedProfileData = exceptionProfiles[p as keyof typeof exceptionProfiles] as {
                    has: boolean, handle: string
                };
    
                if (exceptedProfileData.has) {
                    this[p as keyof SocialMedia] = exceptedProfileData.handle;
                } else {
                    this[p as keyof SocialMedia] = undefined;
                }
            }  
        }

    }

    @Field({ nullable: true })
    facebook?: string;

    @Field({ nullable: true })
    instagram?: string;

    @Field({ nullable: true })
    twitter?: string;

    @Field({ nullable: true })
    youtube?: string;

    @Field({ nullable: true })
    tiktok?: string;
}