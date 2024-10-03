import { useNavigate } from 'react-router-dom';
import { DEFAULT_MAX_AGE, DEFAULT_MIN_AGE, ROOT_ROUTE } from 'src/constants';
import { IState } from 'src/types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import css from './ManageVolunteersPage.module.sass';
import translation from 'src/translations/Russian.json';
import { getVolunteers, GetVolunteersResult } from 'src/utils/getVolunteers';
import { Button, Dot, Loader, Slider } from 'src/components';
import MagnifyerSvg from 'src/assets/magnifyer.svg';
import PhoneSvg from 'src/assets/phone.svg';
import { setVolunteersLoading } from 'src/redux/actions';
import { Dispatch } from '@reduxjs/toolkit';
import FilterSvg from '../../components/elements/Filter/assets/filter.svg';
import { calculateAge } from 'src/utils/calculateAge';

export const ManageVolunteersPage = () => {
  const navigate = useNavigate();
  const dispatch: Dispatch = useDispatch();
  const editor = useSelector((state: IState) => state.editor);
  const [isEditorHasPermissions, setIsEditorHasPermissions] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [toggleFilterMenu, setToggleFilterMenu] = useState(false);
  const [languages, setLanguages] = useState<string[]>([]);
  const [volunteerMinAge, setVolunteerMinAge] = useState(DEFAULT_MIN_AGE);
  const [volunteerMaxAge, setVolunteerMaxAge] = useState(DEFAULT_MAX_AGE);
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showBlockedVolunteers, setShowBlockedVolunteers] = useState(false);
  const limit = useSelector((state: IState) => state.manageVolunteersPage.limit);
  const [volunteers, setVolunteers] = useState<GetVolunteersResult>({
    volunteers: [],
    lastVolunteer: null,
  });
  const [loading, setLoading] = useState(true);
  const [showScrollButton, setShowScrollButton] = useState(false);

  const loadVolunteers = async () => getVolunteers('', [], volunteerMinAge, volunteerMaxAge, '', null, limit);

  const searchVolunteerByName = async (name: string) => {
    const foundVolunteer = await getVolunteers(name, languages, volunteerMinAge, volunteerMaxAge, gender, null, limit);
    setVolunteers(foundVolunteer);
  };

  const applyFilters = async () => {
    setIsLoading(true);
    const filteredVolunteers = await getVolunteers('', languages, volunteerMinAge, volunteerMaxAge, gender, null, limit);
    setVolunteers(filteredVolunteers);
    setToggleFilterMenu(false);
  };

  const capitalizeLanguages = (languages: string[]): string =>
    languages.map(language => language.charAt(0).toUpperCase() + language.slice(1)).join(', ');

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const resetAllFilters = () => {
    setLanguages([]);
    setVolunteerMinAge(DEFAULT_MIN_AGE);
    setVolunteerMaxAge(DEFAULT_MAX_AGE);
    setGender('');
  };

  const handleLanguageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setLanguages(prev => [...prev, value]);
    } else {
      setLanguages(prev => prev.filter(language => language !== value));
    }
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
      getVolunteers('', [], volunteerMinAge, volunteerMaxAge, '', lastVolunteer, limit).then(vols => {
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
        {toggleFilterMenu && (
          <div className={css.filterMenu}>
            <div className={css.titleAndFilter}>
              <p className={css.volunteersTitle}>{translation.filter}</p>
              <button onClick={resetAllFilters} className={css.resetButton}>
                {translation.reset}
              </button>
            </div>
            <div className={css.languagesSection}>
              <p className={css.filterSectionTitle}>{translation.languages}</p>
              <div className={css.languageItem}>
                <input
                  id="english"
                  checked={languages.includes('english')}
                  onChange={handleLanguageChange}
                  className={css.languageInput}
                  type="checkbox"
                  value="english"
                />{' '}
                <label htmlFor="english">English</label>
              </div>
              <div className={css.languageItem}>
                <input
                  id="russain"
                  checked={languages.includes('russian')}
                  onChange={handleLanguageChange}
                  className={css.languageInput}
                  type="checkbox"
                  value="russian"
                />{' '}
                <label htmlFor="russain">Русский</label>
              </div>
              <div className={css.languageItem}>
                <input
                  id="uzbek"
                  checked={languages.includes('uzbek')}
                  onChange={handleLanguageChange}
                  className={css.languageInput}
                  type="checkbox"
                  value="uzbek"
                />{' '}
                <label htmlFor="uzbek">Uzbek</label>
              </div>
              <div className={css.languageItem}>
                <input
                  id="qaraqalpaq"
                  checked={languages.includes('qaraqalpaq')}
                  onChange={handleLanguageChange}
                  className={css.languageInput}
                  type="checkbox"
                  value="qaraqalpaq"
                />{' '}
                <label htmlFor="qaraqalpaq">Qaraqalpaq</label>
              </div>
            </div>
            <Slider
              min={16}
              max={61}
              minValue={volunteerMinAge}
              setMinValue={setVolunteerMinAge}
              maxValue={volunteerMaxAge}
              setMaxValue={setVolunteerMaxAge}
              labelText={translation.age}
            />

            <div className={css.genderSection}>
              <p className={css.genderSectionTitle}>{translation.gender}</p>
              <div className={css.genderItem}>
                <input
                  onChange={e => setGender(e.target.value)}
                  checked={gender === 'men'}
                  value="men"
                  className={css.genderInput}
                  type="radio"
                  name="gender"
                />{' '}
                <label>{translation.men}</label>
              </div>
              <div className={css.genderItem}>
                <input
                  onChange={e => setGender(e.target.value)}
                  checked={gender === 'women'}
                  value="women"
                  className={css.genderInput}
                  type="radio"
                  name="gender"
                />{' '}
                <label>{translation.women}</label>
              </div>
            </div>
            <div className={css.sliderWrapper}>
              <span className={css.showBlockedTitle}>{translation.showBlocked}</span>
              <label className={css.sliderLabel}>
                <input
                  onClick={() => setShowBlockedVolunteers(!showBlockedVolunteers)}
                  type="checkbox"
                  className={css.sliderInput}
                />
                <span className={css.sliderButton}></span>
              </label>
            </div>
            <div className={css.buttonsPanel}>
              <Button onClick={() => setToggleFilterMenu(false)} className={`${css.applyFilterButton} ${css.backButton}`}>
                {translation.return}
              </Button>
              <Button onClick={applyFilters} className={`${css.applyFilterButton} ${css.submitButton}`}>
                {isLoading ? <Loader size={'12px'} /> : translation.apply}
              </Button>
            </div>
          </div>
        )}
        {!toggleFilterMenu && (
          <div className={css.volunteersBlockWrapper}>
            <div className={css.titleAndFilter}>
              <p className={css.volunteersTitle}>{translation.volunteers}</p>
              <img
                onClick={() => {
                  setToggleFilterMenu(!toggleFilterMenu);
                  setIsLoading(false);
                }}
                className={css.eventsFilterIcon}
                src={FilterSvg}
              />
            </div>
            <div className={css.searchbarWrapper}>
              <img className={css.searchIcon} src={MagnifyerSvg} />
              <input
                placeholder={translation.search}
                className={css.searchBar}
                type="text"
                onChange={e => searchVolunteerByName(e.target.value)}
              />
            </div>
            {loading ? (
              <div className={css.loader}>
                <Loader />
              </div>
            ) : volunteers.volunteers.length == 0 ? (
              <div className={css.noVolunteersFound}>No Volunteers Found</div>
            ) : (
              volunteers.volunteers.map((volunteer) => (
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
        )}
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
