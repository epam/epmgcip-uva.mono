import { Route, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';

import App from '../App';
import {
  CREATE_EVENT_ROUTE,
  CREATE_USER_ROUTE,
  EDIT_USER_ROUTE,
  EVENTS_ROUTE,
  EVENT_DETAILS_ROUTE,
  MANAGE_USERS_ROUTE,
  ROOT_ROUTE,
  VOLUNTEERS_ROUTE,
  EDIT_EVENT_ROUTE,
  CREATE_VOLUNTEER,
  VOLUNTEER_DETAILS_ROUTE
} from '../constants';
import { ManageEventsPage, TitlePage } from '../pages';
import { EventFormPage } from 'src/pages/EventFormPage/EventFormPage';
import { ManageVolunteersPage } from 'src/pages/ManageVolunteersPage/ManageVolunteersPage';
import { ManageUsersPage } from 'src/pages/ManageUsersPage/ManageUsersPage';
import { CreateUserPage } from 'src/pages/CreateUserPage/CreateUserPage';
import { EditUserPage } from 'src/pages/EditUserPage/EditUserPage';
import { EventDetailsPage } from 'src/pages/EventDetailsPage/EventDetailsPage';

import { CreateVolunteerPage } from 'src/pages/CreateVolunteerPage/CreateVolunteerPage';
import { VolunteerDetailsPage } from 'src/pages/VolunteerDetailsPage/VolunteerDetailsPage';

const routes = (
  <Route element={<App />}>
    <Route path={ROOT_ROUTE} element={<TitlePage />} />
    <Route path={EVENTS_ROUTE} element={<ManageEventsPage />} />
    <Route path={EVENT_DETAILS_ROUTE} element={<EventDetailsPage />} />
    <Route path={EDIT_EVENT_ROUTE} element={<EventFormPage />} />
    <Route path={CREATE_VOLUNTEER} element={<CreateVolunteerPage />} />
    <Route path={VOLUNTEER_DETAILS_ROUTE} element={<VolunteerDetailsPage />} />
    {/* todo: lazy load pages below (https://reactrouter.com/en/main/route/lazy) */}
    <Route path={CREATE_EVENT_ROUTE} element={<EventFormPage />} />
    <Route path={VOLUNTEERS_ROUTE} element={<ManageVolunteersPage />} />
    <Route path={MANAGE_USERS_ROUTE} element={<ManageUsersPage />} />
    <Route path={CREATE_USER_ROUTE} element={<CreateUserPage />} />
    <Route path={EDIT_USER_ROUTE} element={<EditUserPage />} />
  </Route>
);

const router = createBrowserRouter(createRoutesFromElements(routes));
export default router;
