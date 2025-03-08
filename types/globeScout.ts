export interface GlobeScoutTitleProps {
    city: string;
    loading: boolean;
    error: Error | undefined;
}

export interface GlobeScoutSearchbarProps {
    city: string;
    setCity: React.Dispatch<React.SetStateAction<string>>;
}
