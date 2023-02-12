export interface MovieProps {
    id: number;
    name: string;
    synopsis: string;
    releaseDate: string;
    categories: Array<object>;
    directors: Array<object>;
    countryId: number;
    languageId: number;
    rating: number;
}
