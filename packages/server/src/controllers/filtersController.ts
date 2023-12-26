import {NextFunction, Request, Response} from 'express';
import SuccessResponse from 'src/responses/successResponse';
import filtersRepository from "src/repositories/filtersRepository";

class FiltersController {
    //@ts-ignore //todo: discard this. no longer needed.
    async getAllFilters(request: Request, response: Response, next: NextFunction) {
        try {
            const filters = await filtersRepository.getMatchFilters('');
            response.send(new SuccessResponse({ filters }));
        } catch (e) {
            next(e);
        }
    }
}

const filtersController = new FiltersController();
export default filtersController;
