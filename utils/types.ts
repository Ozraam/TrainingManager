export type Operator = {
    id: number,
    name: string;
    status: string;
};

export type Training = {
    id: number,
    name: string;
    cost: number;
    duration: number;
    date: string;
    operators: Operator[];
};

export type Competence = {
    id: number,
    name: string;
    trainings: Training[];
};

export type YearData = {
    year: number;
    budget: number;
    competences: Competence[];
};
