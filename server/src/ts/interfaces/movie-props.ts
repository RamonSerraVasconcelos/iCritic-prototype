export interface MovieProps {
    id: number;
    name: string;
    synopsis: string;
    releaseDate: string;
    categories: Array<object>;
    directorId: number;
    countryId: number;
    languageId: number;
    rating: number;
}
