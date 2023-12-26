import IScreenedResult from "shared/server/types/response/partials/IScreenedResult";
import {IPaging} from "shared/server/types/response/partials/IPaging";
import {IResultCounts} from "shared/server/types/response/partials/IResultCounts";
import IFiltersData from "shared/server/types/response/partials/IFiltersData";

export default interface IIndividualScreeningResponse {
  results: IScreenedResult[]
  counts: IResultCounts
  paging: IPaging
  filtersData: IFiltersData,
  jobEntityId: string
}
