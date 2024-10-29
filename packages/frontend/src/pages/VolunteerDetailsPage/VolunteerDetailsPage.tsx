import { useEffect, useState } from 'react';
import { getVolunteer } from 'src/utils/getVolunteer';
import { Feedback, IVolunteer, UserStatus } from 'uva-shared';
import css from './VolunteerDetailsPage.module.sass';
import { useParams } from 'react-router-dom';
import { FeedbackDetails } from './components/Feedbacks/Feedbacks';
import { Information } from './components/Information';
import { Line } from 'src/components/elements/Line/Line';
import { useNavigate } from 'react-router-dom';
import { editVolunteer } from 'src/utils/editVolunteer';
import { FeedbackCard } from './components/FeedbackCard/FeedbackCard';
import ChevronLeftSvg from 'src/assets/chevronLeft.svg';
import { deleteVolunteer } from 'src/utils/deleteVolunteer';

export const VolunteerDetailsPage = () => {
  const navigate = useNavigate();
  const { volunteerId } = useParams<{ volunteerId: string }>();
  const [volunteer, setVolunteer] = useState<IVolunteer>();
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'feedback' | 'general'>('feedback');
  const [feedback, setFeedback] = useState<string>('');

  const deleteFeedback = (feedbackToRemove: Feedback) => {
    if (volunteer) {
      const updatedFeedbacks: Partial<IVolunteer> = {
        feedback: volunteer.feedback?.filter(feedback => feedback.text !== feedbackToRemove.text),
      };
      editVolunteer(volunteer.telegramId, updatedFeedbacks);
    }
  };

  const removeVolunteer = () => {
    if (volunteer) deleteVolunteer(volunteer?.telegramId);
    navigate('/volunteers');
  };

  const saveFeedback = (date: string, updatedFeedback: string) => {
    if (volunteer) {
      const newList: Feedback[] | undefined = volunteer.feedback?.map(feedback => {
        if (date === feedback.date) {
          return {
            ...feedback,
            text: updatedFeedback,
            date: Date.now().toLocaleString(),
          };
        }
        return feedback;
      });

      const updatedFeedbacks: Partial<IVolunteer> = {
        feedback: newList,
      };

      editVolunteer(volunteer.telegramId, updatedFeedbacks);
    }
  };

  const changeVolunteerStatus = () => {
    if (volunteer) {
      const newStatus: Partial<IVolunteer> = {
        status: volunteer.status === UserStatus.Active ? UserStatus.Inactive : UserStatus.Active,
      };
      editVolunteer(volunteer.telegramId, newStatus);
    }
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (volunteerId) {
        try {
          await getVolunteer(volunteerId).then(res => setVolunteer(res));
        } catch (error) {
          console.error('Error fetching volunteer:', error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [volunteerId, volunteer?.feedback]);

  const goBack = () => {
    navigate('/volunteers');
  };

  const addFeedback = () => {
    // add admin id here
    if (volunteer) {
      const newFeedback: Feedback = {
        text: feedback!,
        date: Date.now().toString(),
        creatorId: '1',
      };

      const newData: Partial<IVolunteer> = {
        feedback: [...(volunteer.feedback! || []), newFeedback],
      };
      editVolunteer(volunteer.telegramId, newData);
      setFeedback('');
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <>
      <div className={css.toolbar}>
        <button className={css.returnButton} onClick={goBack}>
          <img src={ChevronLeftSvg} />
          Венруться
        </button>
        <div className={css.statusContainer}>
          <span className={`${css.dot} ${volunteer?.status === UserStatus.Active ? css.green : css.red}`}></span>
          <span className={`${volunteer?.status === UserStatus.Active ? css.activeStatus : css.inactiveStatus}`}>
            {volunteer?.status}
          </span>
        </div>
      </div>
      {volunteer ? (
        <div className={css.volunteerContainer}>
          <div className={css.volunteerName}>
            <div>{`${volunteer?.firstName} ${volunteer?.lastName}`}</div>
          </div>
          <div className={css.volunteerGeneralInfo}>
            <div className={css.imageContainer}>
              {imageLoading && <div>Loading Image...</div>}
              <img
                className={css.image}
                src={volunteer.imageURL}
                onLoad={() => setImageLoading(false)}
                onError={() => setImageLoading(false)}
              />
            </div>
            <div>
              <div className={css.infoLine}>
                <div>{volunteer.birthDate}</div>
                <div className={css.divider}>
                  <span className={`${css.dot} ${css.gray}`}></span>
                </div>
                <div>{volunteer.gender}</div>
                <div className={css.divider}>
                  <span className={`${css.dot} ${css.gray}`}></span>
                </div>
                <div>{volunteer.phone}</div>
              </div>
              <div className={css.infoLine}>
                <div className={css.telegramHandle}>{volunteer.telegramName}</div>
              </div>
              <div className={css.infoLine}>
                {volunteer.language.map(lang => (
                  <div key={lang}>{lang}</div>
                ))}
              </div>
              <div className={css.infoLine}>
                <div className={css.email}>{volunteer.email}</div>
              </div>
            </div>
          </div>
          <div className={css.tabContainer}>
            <button className={selectedTab === 'feedback' ? css.activeTab : ''} onClick={() => setSelectedTab('feedback')}>
              Feedback
            </button>
            <button className={selectedTab === 'general' ? css.activeTab : ''} onClick={() => setSelectedTab('general')}>
              General Info
            </button>
          </div>
          <Line />
          <div className={css.tabContent}>
            {selectedTab === 'feedback' ? (
              <>
                <FeedbackDetails value={feedback} setChange={setFeedback} onClick={addFeedback} />
                {volunteer.feedback?.map(elem => {
                  return (
                    <FeedbackCard
                      key={elem.date}
                      feedback={elem}
                      deleteFeedback={deleteFeedback}
                      saveFeedback={saveFeedback}
                    />
                  );
                })}
              </>
            ) : (
              <Information education={volunteer.education} specialization={volunteer.specialization!} />
            )}
            <div className={css.buttonContainer}>
              <button className={css.actionButton} onClick={changeVolunteerStatus}>
                {volunteer.status === UserStatus.Active ? 'Заблокировать' : 'Разблокировать'}
              </button>
              <button className={`${css.actionButton} ${css.removeButton}`} onClick={removeVolunteer}>
                Удалить
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div>No Data Found</div>
      )}
    </>
  );
};
