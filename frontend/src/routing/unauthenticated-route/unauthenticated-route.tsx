import { JSX } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PageRoutesEnum } from '../../common/enums/page-routes.enum';
import { useAuthStore } from '../../common/stores/authentication.store';

function UnAuthenticatedRoute(): JSX.Element {
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    if (!isAuthenticated) {
        return <Outlet />;
    }

    return <Navigate to={PageRoutesEnum.HOME} />;
}

export default UnAuthenticatedRoute;
