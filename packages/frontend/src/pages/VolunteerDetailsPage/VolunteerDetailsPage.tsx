import { useEffect, useState } from 'react';
import { getVolunteer } from 'src/utils/getVolunteer';
import { IVolunteer } from 'uva-shared';
import { Button, Dot } from 'src/components';
import css from './VolunteerDetailsPage.module.sass';
import { useParams } from 'react-router-dom';
import { Feedback } from './components/Feedbacks';
import { Information } from './components/Information';
import { Line } from 'src/components/elements/Line/Line';
import { useNavigate } from 'react-router-dom';

export const VolunteerDetailsPage = () => {
  const navigate = useNavigate();
  const { volunteerId } = useParams<{ volunteerId: string }>();

  //   const [imageLoading, setImageLoading] = useState(true);
  //   const [loading, setLoading] = useState(true);
  const [volunteer, setVolunteer] = useState<IVolunteer>();
  const [loading, setLoading] = useState(true);
  const [imageLoading, setImageLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'feedback' | 'general'>('feedback');
  const [feedback, setFeedback] = useState<string>('');

  useEffect(() => {
    const fetchEvent = async () => {
      if (volunteerId) {
        await getVolunteer(volunteerId).then(res => setVolunteer(res));
      } else {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [volunteerId]);

  const goBack = () => {
    navigate('/volunteers');
  };

  const addFeedback = () => {
    console.log(feedback);
    setFeedback('');
  }

  return (
    <>
      <Button onClick={goBack}>
        <div>Вернуться</div>
      </Button>
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
                  <Dot color="green" />
                </div>
                <div>{volunteer.gender}</div>
                <div className={css.divider}>
                  <Dot color="green" />
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
          {/* tab buttons */}
          <div className={css.tabContainer}>
            <button className={selectedTab === 'feedback' ? css.activeTab : ''} onClick={() => setSelectedTab('feedback')}>
              Feedback
            </button>
            <button className={selectedTab === 'general' ? css.activeTab : ''} onClick={() => setSelectedTab('general')}>
              General Info
            </button>
          </div>
          <Line />
          {/* arden content */}
          <div className={css.tabContent}>
            {selectedTab === 'feedback' ? (
              <Feedback value={feedback} setChange={setFeedback} onClick={addFeedback} />
            ) : (
              <Information education={volunteer.education} specialization={volunteer.specialization!} />
            )}
          </div>
        </div>
      ) : (
        <div>No Data Found</div>
      )}
    </>
  );
};
