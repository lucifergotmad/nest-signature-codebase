import { IsOptionalSortBy } from 'src/core/decorator/optional-sort-by.decorated';
import { IsStringNumber } from 'src/core/decorator/optional-string-number.decorator';
import { IsOptionalString } from 'src/core/decorator/optional-string.decorator';

export class GetPaginationDTO {
  @IsStringNumber()
  skip: string;

  @IsStringNumber()
  limit: string;

  @IsOptionalSortBy()
  sort_by?: Record<string, 'asc' | 'ascending' | 'desc' | 'descending'>;

  @IsOptionalString()
  first: string;
}
