import { useEffect, useState } from "react";
import { IEvent } from "src/types";

export const useRegistrationStatus = (event: IEvent) => {
    const [isRegistrationOpen, setIsRegistrationOpen] = useState<boolean>(false);

    useEffect(() => {
        // todo: find out how to understand if registration is open
        const calculateIsRegistrationOpen = () => {
            return new Date(event.registrationDate) < new Date(new Date().setHours(23, 59, 59, 999));
        };

        setIsRegistrationOpen(calculateIsRegistrationOpen());
    }, [event]);

    return isRegistrationOpen;
};
