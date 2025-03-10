export interface GlobeScoutTitleProps {
    city: string;
    message: string;
}

export interface GlobeScoutSearchbarProps {
    city: string;
    setCity: React.Dispatch<React.SetStateAction<string>>;
}
