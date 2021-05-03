import { ObjectType, Field } from 'type-graphql';
import CLUB_PROFILES from '../../clubProfiles.json';

interface ProfileException {
    has: boolean,
    handle: string
}

@ObjectType({ description: 'Collection of social media profiles for a club or player.' })
export class SocialMedia {
    /** Fetches all social media handles for a given club.
     * @param clubShortName A club's short name
     */
    constructor(clubShortName: string) {
        if (CLUB_PROFILES[clubShortName as keyof typeof CLUB_PROFILES]) {
            const clubProfiles = CLUB_PROFILES[clubShortName as keyof typeof CLUB_PROFILES];
            const defaultHandle = clubProfiles.defaultHandle;
    
            this.facebook = `https://facebook.com/${defaultHandle}`;
            this.instagram = `https://instagram.com/${defaultHandle}`;
            this.twitter = `https://twitter.com/${defaultHandle}`;
            this.youtube = `https://youtube.com/${defaultHandle}`;
            this.tiktok = `https://tiktok.com/@${defaultHandle}`;
    
            const exceptionProfiles = clubProfiles.except || {};
    
            for (let p in exceptionProfiles) {
                let exceptedProfileData = exceptionProfiles[p as keyof typeof exceptionProfiles] as ProfileException
    
                if (exceptedProfileData.has) {
                    this[p as keyof SocialMedia] = exceptedProfileData.handle;

                    switch (p) {
                        case 'facebook':
                            this.facebook = `https://facebook.com/${exceptedProfileData.handle}`;
                            break;
                        case 'instagram':
                            this.instagram = `https://instagram.com/${exceptedProfileData.handle}`;
                            break;
                        case 'twitter':
                            this.twitter = `https://facebook.com/${exceptedProfileData.handle}`;
                            break;
                        case 'youtube':
                            this.youtube = `https://youtube.com/${exceptedProfileData.handle}`;
                            break;
                        case 'tiktok':
                            this.tiktok = `https://tiktok.com/@${exceptedProfileData.handle}`;
                    }
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