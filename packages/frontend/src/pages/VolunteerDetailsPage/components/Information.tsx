import css from './../VolunteerDetailsPage.module.sass'

interface InformationParams {
    education: string,
    specialization: string,
    interests?: string
}

export const Information = ({education, specialization, interests}: InformationParams) => {
    return (
        <div className={css.generalInfo}>
            <div>
                Уровень образования: {education}
            </div>
            <div>
                Специализация: {specialization}
            </div>
            <div>
                Интересы: {interests}
            </div>
        </div>
    )
}