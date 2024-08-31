import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogoSvg from 'src/assets/logo.svg';
import { Button, Loader, PageWrapper, Toolbar } from 'src/components';
import { Filter } from 'src/components/elements/Filter/Filter';
import { CREATE_EVENT_ROUTE, ROOT_ROUTE } from 'src/constants';
import { saveEvents, setEventsLoading, setEventsStatusFilter } from 'src/redux/actions';
import translation from 'src/translations/Russian.json';
import { EventStatus, IState } from 'src/types';
import { getEvents } from 'src/utils/getEvents';
import css from './ManageEventsPage.module.sass';
import { EventCard } from './components/EventCard/EventCard';

export const ManageEventsPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();

  const savedScrollSize = useSelector((state: IState) => state.manageEventsPage.scrollSize);

  const eventsData = useSelector((state: IState) => state.manageEventsPage.data);
  const filter = useSelector((state: IState) => state.manageEventsPage.statusFilter);
  const limit = useSelector((state: IState) => state.manageEventsPage.limit);
  const editor = useSelector((state: IState) => state.editor);
  const [showNext, setShowNext] = useState(false);

  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);
    if (!eventsData.error && (!eventsData.initialized || (!eventsData.finished && showNext))) {
      const lastEventStartDate = eventsData.data.length && eventsData.initialized
        ? eventsData.data[eventsData.data.length - 1].startDate
        : undefined;
      getEvents(filter, lastEventStartDate, limit)
        .then(events => {
          dispatch(
            saveEvents(
              events.events,
              false,
              Boolean(!events.events?.length),
              eventsData.initialized
            )
          );
          setShowNext(false);
        })
        .catch(err => {
          dispatch(saveEvents([], true, false));
          console.error(err);
          setShowNext(false);
        });
    }
  }, [dispatch, editor, navigate, filter, limit, showNext, eventsData]);

  useEffect(() => {
    setTimeout(() => window.scrollTo(0, savedScrollSize), 0);
  }, [savedScrollSize]);

  const handleCreateEvent = () => {
    navigate(CREATE_EVENT_ROUTE);
  };

  if (!isEditorHasPermissions) {
    return null;
  }

  return (
    <PageWrapper
      withBottomBorder={false}
      toolbar={
        <>
          <Toolbar
            title={translation.events}
            buttonText={translation.create}
            onClick={handleCreateEvent}
          />
          <Filter
            value={filter}
            setChange={status => {
              dispatch(setEventsStatusFilter(status));
            }}
            options={[
              { name: translation.all, value: 'all' },
              { name: translation.draftEvent, value: EventStatus.Draft },
              { name: translation.activeEvent, value: EventStatus.Active },
              { name: translation.completedEvent, value: EventStatus.Completed },
              { name: translation.canceledEvent, value: EventStatus.Canceled },
            ]}
          />
        </>
      }
      page={
        <>
          <div className={css.eventsBlockWrapper}>
            {eventsData.initialized &&
              eventsData.data.length > 0 &&
              !eventsData.error &&
              eventsData.data.map(event => <EventCard event={event} key={event.id} />)}
            {eventsData.initialized && eventsData.data.length === 0 && !eventsData.error && (
              <>
                <img className={css.eventsBlockLogo} src={LogoSvg} />
                <div className={css.emptyMessage}>{translation.emptyEventsList}</div>
              </>
            )}
            {eventsData.error && (
              <div className={css.loader}>
                <span>{translation.loadingError}</span>
              </div>
            )}
            {eventsData.loading && (
              <div className={css.loader}>
                <Loader />
              </div>
            )}
          </div>
          {eventsData.initialized && !eventsData.finished && eventsData.data.length >= limit && (
            <Button
              className={css.loadMoreButton}
              onClick={() => {
                setShowNext(true);
                dispatch(setEventsLoading(true));
              }}
            >
              {translation.loadMore}
            </Button>
          )}
        </>
      }
    />
  );
};
