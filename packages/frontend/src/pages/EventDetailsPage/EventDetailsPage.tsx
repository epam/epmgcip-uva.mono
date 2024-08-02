import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getEvent, getEventNameInLanguage } from 'src/utils/getEvent';
import { IEvent } from 'src/types';


export const EventDetailsPage = () => {
  const { eventId } = useParams<{ eventId: string }>();
  const [event, setEvent] = useState<IEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvent = async () => {
      if (eventId) {
        try {
          const eventData = await getEvent(eventId);
          if (eventData) {
            setEvent(eventData);
          } else {
            setError('Event not found');
          }
        } catch (err) {
          console.error('Error fetching event:', err);
        } finally {
          setLoading(false);
        }
      } else {
        console.log('No eventId provided');
        setLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Event Details</h1>
      {event ? (
        <div>
          <p>{getEventNameInLanguage(event)}</p>
        </div>
      ) : (
        <p>No event data found</p>
      )}
    </div>
  );
};
