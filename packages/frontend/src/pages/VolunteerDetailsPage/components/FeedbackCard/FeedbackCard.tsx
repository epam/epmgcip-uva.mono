import { useState } from 'react';
import { Feedback } from 'uva-shared';
import OverflowMenuSvg from 'src/assets/overflowMenu.svg';
import css from './FeedbackCard.module.sass';

export const FeedbackCard = ({
  feedback,
  deleteFeedback,
  saveFeedback,
}: {
  feedback: Feedback;
  deleteFeedback: (feedbackToRemove: Feedback) => void;
  saveFeedback: (date: string, updatedFeedback: string) => void;
}) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);
  const [isEdible, setIsEdible] = useState<boolean>(false);
  const [currentFeedback, setCurrentFeedback] = useState<string>(feedback.text);

  const onEditFeedback = () => {
    setIsEdible(true);
    setIsMenuOpened(false);
  };

  const onCancel = () => {
    setCurrentFeedback(feedback.text);
    setIsEdible(false);
  };

  const onDeleteFeedback = () => {
    deleteFeedback(feedback);
    setIsMenuOpened(false);
  };

  const onSaveFeedback = () => {
    saveFeedback(feedback.date, currentFeedback);
    setIsEdible(false);
  };

  return (
    <article className={css.feedbackCard}>
      <div className={css.feedbackCardInfo}>
        <header className={css.feedbackCardHeader}>
          <h2 className={css.feedbackCardTitle}>{feedback.creatorId}</h2>
          <div className={css.headerRight}>
            <span>{feedback.date}</span>
            <div className={css.menuButtonWrapper}>
              <span onClick={() => setIsMenuOpened(!isMenuOpened)} className={css.menuButton}>
                <img src={OverflowMenuSvg} />
              </span>
              {isMenuOpened && (
                <div className={css.menu}>
                  <button className={css.actionButton} onClick={onEditFeedback}>
                    Редактировать
                  </button>
                  <button className={`${css.actionButton} ${css.removeButton}`} onClick={onDeleteFeedback}>
                    Удалить
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <section className={css.eventCardAdditionalInfo}>
          <div className={css.eventCardAdditionalInfoLine}>
            {isEdible ? (
              <>
                <textarea
                  className={css.feedbackTextarea}
                  value={currentFeedback}
                  onChange={e => setCurrentFeedback(e.target.value)}
                >
                  {currentFeedback}
                </textarea>
                <div className={css.editButtonContainer}>
                  <button className={css.actionButton} onClick={onCancel}>
                    Отмена
                  </button>
                  <button className={`${css.actionButton} ${css.saveButton}`} onClick={onSaveFeedback}>
                    Сохранить
                  </button>
                </div>
              </>
            ) : (
              <span>{currentFeedback}</span>
            )}
          </div>
        </section>
      </div>
    </article>
  );
};
