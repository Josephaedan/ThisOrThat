import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

interface AuthenticatedRouteProps {
    children: React.ReactNode;
}

export default function AuthenticatedRoute({children}: AuthenticatedRouteProps): JSX.Element {
    const {data: session} = useSession();
    const router = useRouter();
    const {pathname} = router;

    useEffect(() => {
        if (!session) {
            router.push({
                pathname: "/auth/signin",
                query: {redirect: pathname},
            }, "/auth/signin");
        }
    }, [session, router, pathname]);

    return <>{children}</>;
}