import type { Href } from 'expo-router';

type AuthRouter = {
    replace: (href: Href) => void;
};

type FinalizeNavigateParams = {
    session?: {
        currentTask?: unknown;
    } | null;
    decorateUrl: (url: string) => string;
};

export const createAuthNavigate = (router: AuthRouter) => {
    return ({ session, decorateUrl }: FinalizeNavigateParams) => {
        if (session?.currentTask) {
            console.log(session.currentTask);
            return;
        }

        const url = decorateUrl('/(tabs)');
        if (url.startsWith('http')) {
            // Only use window.location on web platform
            if (typeof window !== 'undefined' && window.location) {
                window.location.href = url;
            } else {
                // On native, just use router navigation
                router.replace('/(tabs)' as Href);
            }
        } else {
            router.replace(url as Href);
        }
    };
};
