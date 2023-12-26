import IAlertsResult from "shared/server/types/response/partials/IAlertsResult";
import {IPaging} from "shared/server/types/response/partials/IPaging";
import IFiltersData from "shared/server/types/response/partials/IFiltersData";

export default interface IAlertsResponse {
  results: IAlertsResult[]
  paging: IPaging
  filtersData: IFiltersData
}
