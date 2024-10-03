import { useNavigate } from 'react-router-dom';
import { ROOT_ROUTE } from 'src/constants';
import { IState } from 'src/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import css from './ManageVolunteersPage.module.sass';
import translation from 'src/translations/Russian.json';
import { getVolunteers, GetVolunteersResult } from 'src/utils/getVolunteers';
import { Button, Dot, Loader } from 'src/components';
import MagnifyerSvg from 'src/assets/magnifyer.svg';
import PhoneSvg from 'src/assets/phone.svg';
import { setVolunteersLoading } from 'src/redux/actions';
import { Dispatch } from '@reduxjs/toolkit';

export const ManageVolunteersPage = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const limit = useSelector((state: IState) => state.manageVolunteersPage.limit);
  const [volunteers, setVolunteers] = useState<GetVolunteersResult>({
    volunteers: [],
    lastVolunteer: null,
  });
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const loadVolunteers = async () => getVolunteers('', null, limit);

  const searchVolunteer = async (name: string) => {
    const foundVolunteer = await getVolunteers(name);
    setVolunteers(foundVolunteer);
  };

  const calculateAge = (birthDate: string): number => {
    const [day, month, year] = birthDate.split('-').map(Number);
    const birthDateObj = new Date(year, month - 1, day);
    const today = new Date();
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    const dayDiff = today.getDate() - birthDateObj.getDate();
    if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
      age--;
    }
    return age;
  };

  const capitalizeLanguages = (languages: string[]): string =>
    languages.map(language => language.charAt(0).toUpperCase() + language.slice(1)).join(', ');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowScrollButton(true);
      } else {
        setShowScrollButton(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    if (showNext) {
      const lastVolunteer = volunteers.lastVolunteer;
      getVolunteers('', lastVolunteer, limit).then(vols => {
        setVolunteers(prev => ({
          volunteers: [...prev.volunteers, ...vols.volunteers],
          lastVolunteer: vols.lastVolunteer,
        }));
        setShowNext(false);
      });
    }
  }, [showNext, volunteers.lastVolunteer, limit]);

  useEffect(() => {
    editor.role ? setIsEditorHasPermissions(() => true) : navigate(ROOT_ROUTE);
    const fetchVolunteers = async () => {
      try {
        setLoading(true);
        const vols = await loadVolunteers();
        setVolunteers(vols);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    };
    fetchVolunteers();
  }, [editor, navigate]);

  return (
    isEditorHasPermissions && (
      <>
        <div className={css.volunteersBlockWrapper}>
          <p className={css.volunteersTitle}>{translation.volunteers}</p>
          <div className={css.searchbarWrapper}>
            <img className={css.searchIcon} src={MagnifyerSvg} />
            <input
              placeholder={translation.search}
              className={css.searchBar}
              type="text"
              onChange={e => searchVolunteer(e.target.value)}
            />
          </div>
          {loading ? (
            <div className={css.loader}>
              <Loader />
            </div>
          ) : (
            volunteers.volunteers.map(volunteer => (
              <div key={volunteer.id} className={css.volunteerCard}>
                <p className={css.volunteerFullName}>
                  {volunteer.firstName} {volunteer.lastName}
                </p>
                <div className={css.volunteerInfoWrapper}>
                  <span>{volunteer.gender === 'men' ? 'М' : 'Ж'}</span>
                  <span className={css.dotSpan}>
                    <Dot color={'gray'} />
                  </span>
                  <span>{calculateAge(volunteer.birthDate)}</span>
                  <span>{translation.years}</span>
                  <span className={css.dotSpan}>
                    <Dot color={'gray'} />
                  </span>
                  <span>{capitalizeLanguages(volunteer.language)}</span>
                  <span className={css.dotSpan}>
                    <Dot color={'gray'} />
                  </span>
                  <p>{volunteer.telegramName}</p>
                </div>
                <div className={css.phoneIconContainer}>
                  <p>
                    <img className={css.phoneIcon} src={PhoneSvg} />
                  </p>
                  <p>{volunteer.phone}</p>
                </div>
              </div>
            ))
          )}
        </div>
        {!showNext && volunteers.volunteers.length >= limit && (
          <Button
            className={css.loadMoreButton}
            onClick={() => {
              setShowNext(true);
              dispatch(setVolunteersLoading(true));
            }}
          >
            {translation.loadMore}
          </Button>
        )}
        {showScrollButton && (
          <Button className={css.scrollToTopButton} onClick={scrollToTop}>
            Up
          </Button>
        )}
      </>
    )
  );
};
