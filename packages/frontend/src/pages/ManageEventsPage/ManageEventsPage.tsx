import { useNavigate } from 'react-router-dom';
import { ROOT_ROUTE } from 'src/constants';
import { IState } from 'src/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import css from './ManageEventsPage.module.sass';
import LogoSvg from 'src/assets/logo.svg';
import translation from 'src/translations/Russian.json';

export const ManageEventsPage = () => {
  const navigate = useNavigate();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);
  }, [editor, navigate]);

  return (
    isEditorHasPermissions && (
      <>
        <div className={css.eventsBlockWrapper}>
          <img className={css.eventsBlockLogo} src={LogoSvg} />
          <div className={css.emptyMessage}>{translation.emptyEventsList}</div>
        </div>
      </>
    )
  );
};
