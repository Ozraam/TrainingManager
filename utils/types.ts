/* eslint-disable no-use-before-define */
export type Operator = {
    id_op: number;
    name: string;
    surname: string;
    status: string;
    Position: Position;
    Registration: Registration[];
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
    valid: boolean;
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
    Training: Training;
    id_op: number;
    id_train: number;
    date: string;
    id_state: number;
};

export type PositionComp = {
    id_pos: number;
    id_comp: number;
    Competences: Competence;
};

export type Position = {
    id_pos: number;
    name: string;
    Position_comp: PositionComp[];
};
