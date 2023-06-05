export interface LoginRequest {
    name: string;
    email: string;
}

export interface DogIdQueryParams {
    breeds?: string[];
    zipCodes?: string[];
    ageMin?: number;
    ageMax?: number;
    size?: number;
    from?: number;
    sort?: string;
}

export interface Dog {
    id: string;
    img: string;
    name: string;
    age: number;
    zip_code: string;
    breed: string;
    isImageLoading: boolean;
    isImageLoadingError: boolean;
}

export interface Match {
    match: string
}