import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import App from '../App';
import { ManageUsersPage, TitlePage, CreateUserPage } from '../pages';
import {
  CREATE_EVENT_ROUTE,
  CREATE_USER_ROUTE,
  EVENTS_ROUTE,
  LOGIN_ROUTE,
  MANAGE_USERS_ROUTE,
  ROOT_ROUTE,
  VOLUNTEERS_ROUTE,
} from '../constants';

const routes = (
  <Route element={<App />}>
    <Route path={ROOT_ROUTE} element={<TitlePage />} />
    <Route path={LOGIN_ROUTE} element={<div>login</div>} />
    <Route path={EVENTS_ROUTE} element={<div>events</div>} />
    <Route path={CREATE_EVENT_ROUTE} element={<div>create event</div>} />
    <Route path={VOLUNTEERS_ROUTE} element={<div>create event</div>} />
    <Route path={MANAGE_USERS_ROUTE} element={<ManageUsersPage />} />
    <Route path={CREATE_USER_ROUTE} element={<CreateUserPage />} />
  </Route>
);

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
