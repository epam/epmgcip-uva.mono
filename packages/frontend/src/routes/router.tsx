import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';

import App from '../App';
import { ManageUsersPage, TitlePage, CreateUserPage, EditUserPage, ManageEventsPage, CreateEventPage, ManageVolunteersPage } from '../pages';
import {
  CREATE_EVENT_ROUTE,
  CREATE_USER_ROUTE,
  EDIT_USER_ROUTE,
  EVENTS_ROUTE,
  MANAGE_USERS_ROUTE,
  ROOT_ROUTE,
  VOLUNTEERS_ROUTE,
} from '../constants';

const routes = (
  <Route element={<App />}>
    <Route path={ROOT_ROUTE} element={<TitlePage />} />
    <Route path={EVENTS_ROUTE} element={<ManageEventsPage />} />
    <Route path={CREATE_EVENT_ROUTE} element={<CreateEventPage />} />
    <Route path={VOLUNTEERS_ROUTE} element={<ManageVolunteersPage />} />
    <Route path={MANAGE_USERS_ROUTE} element={<ManageUsersPage />} />
    <Route path={CREATE_USER_ROUTE} element={<CreateUserPage />} />
    <Route path={EDIT_USER_ROUTE} element={<EditUserPage />} />
  </Route>
);

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
