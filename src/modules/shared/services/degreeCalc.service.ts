import { Injectable } from '@nestjs/common';
import { CustomError } from '../helpers/customError';
import { Grade } from 'src/modules/degree/enums/grade.enum';

@Injectable()
export class DegreeCalcService {
    constructor(
        
    ) {}

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    async calculateGBA(highestDegree: number, degree: number) {
        return ((degree / highestDegree) * 4).toFixed(2);
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////

    async calculateAcademicGrade(GBA: number) {
        if (GBA < 2) {
            return Grade.Fail;
        } else if (GBA >= 2 && GBA < 2.5) {
            return Grade.Pass;
        } else if (GBA >= 2.5 && GBA < 3) {
            return Grade.Good;
        } else if (GBA >= 3 && GBA < 3.5) {
            return Grade.VeryGood;
        } else {
            return Grade.Excellent;
        }
    }
}
