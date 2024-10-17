import { Button, Input } from 'src/components';
import { IAction } from 'src/redux/types';

type InputChange = (value: string) => {
  type: string;
  payload: string;
};

export type OnInputChange = React.Dispatch<React.SetStateAction<string>> | InputChange | ((inputString: string) => IAction);

interface InputProps {
    value: string;
    setChange: OnInputChange;
    onClick: (() => void) | undefined
}

export const Feedback = ({ value, setChange, onClick }: InputProps) => {
    return (
        <div>
            <Input
            value={value}
            setChange={setChange}
            />
            <Button onClick={onClick}>
                <div>enter</div>
            </Button>
        </div>
    )
}