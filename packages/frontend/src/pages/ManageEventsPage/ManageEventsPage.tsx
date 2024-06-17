import { Dispatch } from '@reduxjs/toolkit';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import LogoSvg from 'src/assets/logo.svg';
import { PageWrapper, Toolbar } from 'src/components';
import { Filter } from 'src/components/elements/Filter/Filter';
import { CREATE_EVENT_ROUTE, ROOT_ROUTE } from 'src/constants';
import {
  addEventsToList,
  saveEvents,
  setEventsPage,
  setEventsStatusFilter,
} from 'src/redux/actions';
import translation from 'src/translations/Russian.json';
import { EventStatus, FilterEventStatuses, IEvent, IState } from 'src/types';
import { CacheKey, cacheUtils } from 'src/utils/cache.utils';
import { getEvents } from 'src/utils/getEvents';
import css from './ManageEventsPage.module.sass';
import { EventCard } from './components/EventCard/EventCard';

const getCacheKey = (filter: FilterEventStatuses, page: number) =>
  `eventsList-${filter ?? ''}-${page}`;

export const ManageEventsPage = () => {
  const dispatch: Dispatch = useDispatch();
  const navigate = useNavigate();

  const currentEventsList = useSelector((state: IState) => state.eventsList);
  const savedScrollSize = useSelector((state: IState) => state.manageEventsPage.scrollSize);
  const filter = useSelector((state: IState) => state.manageEventsPage.statusFilter);
  const page = useSelector((state: IState) => state.manageEventsPage.page);
  const editor = useSelector((state: IState) => state.editor);

  const [isLoading, setIsLoading] = useState(currentEventsList.length === 0);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [eventsCache] = useState(cacheUtils<IEvent[]>(CacheKey.Events));

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);

    if (isLoading) {
      let tmpPage = 0;
      for (; tmpPage <= page; tmpPage++) {
        const key = getCacheKey(filter, tmpPage);
        const cachedValue = eventsCache.getCache(key);
        if (cachedValue) {
          dispatch(tmpPage === 0 ? saveEvents(cachedValue) : addEventsToList(cachedValue));
        } else {
          break;
        }
      }
      if (tmpPage <= page) {
        getEvents(filter, tmpPage).then(events => {
          const key = getCacheKey(filter, tmpPage);
          eventsCache.setCache(key, events);
          setIsLoading(false);
          dispatch(tmpPage === 0 ? saveEvents(events) : addEventsToList(events));
          dispatch(setEventsPage(tmpPage));
        });
      } else {
        setIsLoading(false);
      }
    }
  }, [dispatch, editor, isLoading, navigate, eventsCache, filter, page]);

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
              setIsLoading(true);
            }}
            options={[
              { name: translation.all, value: 'all' },
              { name: translation.draftEvent, value: EventStatus.Draft },
              { name: translation.activeEvent, value: EventStatus.Active },
              { name: translation.completed, value: EventStatus.Completed },
              { name: translation.cancelled, value: EventStatus.Canceled },
            ]}
          />
        </>
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
