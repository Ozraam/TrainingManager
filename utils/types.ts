export type Operator = {
    id_op: number;
    name: string;
    surname: string;
    status: string;
};

export type Training = {
    id_train: number;
    name: string;
    date: string;
    duration: number;
    cost: number;
    id_teacher: number;
    id_comp: number;
    id_type_train: number;
    topic: string;
    operators: Operator[];
};

export type Competence = {
    id_comp: number;
    name: string;
    tmp_validity: number;
    trainings: Training[];
};

export type YearData = {
    year: number;
    budget: number;
    competences: Competence[];
};

export type Registration = {
    id_op: number;
    id_train: number;
    date: string;
    id_state: number;
};
