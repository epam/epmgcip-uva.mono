import { useNavigate } from 'react-router-dom';
import { ROOT_ROUTE } from 'src/constants';
import { checkUserAuthorization } from 'src/utils';
import { IState } from 'src/types';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';

export const CreateEventPage = () => {
  const navigate = useNavigate();
  const editor = useSelector((state: IState) => state.editor);

  useEffect(() => {
    if (!checkUserAuthorization(editor)) {
      navigate(ROOT_ROUTE);
    }
  }, [editor, navigate]);

  return checkUserAuthorization(editor) && <div>Create Event Page</div>;
};
