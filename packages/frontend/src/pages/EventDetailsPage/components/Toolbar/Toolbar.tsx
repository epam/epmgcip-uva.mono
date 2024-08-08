import { useState } from 'react';
import { IToolbarActions } from '../../EventDetailsPage';
import css from './Toolbar.module.sass';
import ChevronLeftSvg from 'src/assets/chevronLeft.svg';
import OverflowMenuSvg from 'src/assets/overflowMenu.svg';

interface ToolbarProps {
  menuActions: IToolbarActions[];
  buttonBack: IToolbarActions;
}


export const Toolbar = ({ menuActions, buttonBack }: ToolbarProps) => {
  const [isMenuOpened, setIsMenuOpened] = useState(false);

  return (
    <div className={css.toolbar}>
      <button className={css.returnButton} onClick={buttonBack.onClick}>
      <img src={ChevronLeftSvg} />
        {buttonBack.title}
      </button>
      <div className={css.menuButtonWrapper}>
        <span 
        onClick={()=>setIsMenuOpened(!isMenuOpened)}
          className={css.menuButton}
        >
          <img src={OverflowMenuSvg} />
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
