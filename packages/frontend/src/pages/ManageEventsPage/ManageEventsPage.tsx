import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogoSvg from 'src/assets/logo.svg';
import { PageWrapper, Toolbar } from 'src/components';
import { CREATE_EVENT_ROUTE, ROOT_ROUTE } from 'src/constants';
import { addEventsToList } from 'src/redux/actions';
import translation from 'src/translations/Russian.json';
import { IState } from 'src/types';
import { getEvents } from 'src/utils/getEvents';
import css from './ManageEventsPage.module.sass';
import { EventCard } from './components/EventCard/EventCard';

export const ManageEventsPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();
  const currentEventsList = useSelector((state: IState) => state.eventsList);
  const [isLoading, setIsLoading] = useState(currentEventsList.length === 0);
  const savedScrollSize = useSelector((state: IState) => state.manageEventsPage.scrollSize);
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);

    if (isLoading) {
      getEvents().then(result => {
        setIsLoading(false);
        dispatch(addEventsToList(result));
      });
    }
  }, [dispatch, editor, isLoading, navigate]);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, savedScrollSize), 0);
  });

  const handleCreateEvent = () => {
    navigate(CREATE_EVENT_ROUTE);
  };

  if (!isEditorHasPermissions) {
    return null;
  }

  return (
    <PageWrapper
      toolbar={
        <Toolbar
          title={translation.events}
          buttonText={translation.create}
          onClick={handleCreateEvent}
        />
      }
      page={
        <div className={css.eventsBlockWrapper}>
          {currentEventsList.length > 0 ? (
            currentEventsList.map(event => <EventCard event={event} key={event.id} />)
          ) : (
            <>
              <img className={css.eventsBlockLogo} src={LogoSvg} />
              <div className={css.emptyMessage}>{translation.emptyEventsList}</div>
            </>
          )}
        </div>
      }
    />
  );
};
