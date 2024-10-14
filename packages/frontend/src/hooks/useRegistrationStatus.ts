import { useEffect, useState } from "react";
import { IEvent } from "src/types";

export const useRegistrationStatus = (event: IEvent) => {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);

    useEffect(() => {
        const calculateIsRegistrationOpen = () => {
            const registrationDateParts = event.registrationDate.split('-');
            const registrationDate = new Date(
                Number(registrationDateParts[2]),
                Number(registrationDateParts[1]) - 1,
                Number(registrationDateParts[0])
            );
            console.log(registrationDate < new Date(new Date().setHours(23, 59, 59, 999)))
            return registrationDate < new Date(new Date().setHours(23, 59, 59, 999));
        };

        setIsRegistrationOpen(calculateIsRegistrationOpen());
    }, [event]);

    return isRegistrationOpen;
};
