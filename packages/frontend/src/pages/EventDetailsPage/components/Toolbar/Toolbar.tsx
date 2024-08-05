import { useState } from 'react';
import { IToolbarActions } from '../../EventDetailsPage';
import css from './Toolbar.module.sass';
interface ToolbarProps {
  menuActions: IToolbarActions[];
  buttonBack: IToolbarActions;
}


export const Toolbar = ({ menuActions, buttonBack }: ToolbarProps) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <div className={css.toolbar}>
      <button className={css.returnButton} onClick={buttonBack.onClick}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          width="17"
          height="17"
          className="size-6"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        </svg>
        {buttonBack.title}
      </button>
      <div className={css.menuButtonWrapper}>
        <span 
        onClick={()=>setIsMenuOpened(!isMenuOpened)}
          className={css.menuButton}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            width="17"
            height="17"
            stroke="currentColor"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z"
            />
          </svg>
        </span>
        <div className={`${css.menu} ${isMenuOpened ? css.activeMenu: ''}`}>
          {menuActions.map(action => (
            <button key={action.title} className={css.actionButton} onClick={action.onClick}>{action.title}</button>
          ))}
        </div>
      </div>

    </div>
  );
};
