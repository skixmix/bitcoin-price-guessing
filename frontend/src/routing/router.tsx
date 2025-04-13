import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import { PageRoutesEnum } from '../common/enums/page-routes.enum';
import HomePage from '../pages/home/home-page';
import LoginPage from '../pages/login/login-page';
import AuthenticatedRoute from './authenticated-route/authenticated-route';
import UnAuthenticatedRoute from './unauthenticated-route/unauthenticated-route';

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route element={<AuthenticatedRoute />}>
                    <Route path={PageRoutesEnum.HOME} element={<HomePage />} />
                </Route>

                <Route element={<UnAuthenticatedRoute />}>
                    <Route path={PageRoutesEnum.LOGIN} element={<LoginPage />} />
                </Route>

                <Route path="*" element={<Navigate to={PageRoutesEnum.HOME} />} />
            </Routes>
        </Router>
    );
};

export default AppRouter;
