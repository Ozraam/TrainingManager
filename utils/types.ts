export type Operator = {
    name: string;
    status: string;
};

export type Training = {
    name: string;
    cost: number;
    duration: number;
    date: string;
    operators: Operator[];
};

export type Competence = {
    name: string;
    trainings: Training[];
};

export type YearData = {
    year: number;
    budget: number;
    competences: Competence[];
};
