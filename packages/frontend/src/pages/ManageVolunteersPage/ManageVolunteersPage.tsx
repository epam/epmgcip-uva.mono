import { useNavigate } from 'react-router-dom';
import { ROOT_ROUTE } from 'src/constants';
import { IState } from 'src/types';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export const ManageVolunteersPage = () => {
  const navigate = useNavigate();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);
  }, [editor, navigate]);

  return isEditorHasPermissions && <div>List Volunteers Page</div>;
};
