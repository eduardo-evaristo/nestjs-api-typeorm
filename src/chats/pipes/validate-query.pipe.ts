import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { QueryParam } from '../constants/queryParam';

export class ValidateQuery implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata): QueryParam {
    if (Object.keys(value).length === 0) return {};

    //If user has included a query string and it has 'page'
    if (Object.keys(value).includes('page')) {
      const page = value.page;

      //Checking to see if page is a number and is valid
      if (isNaN(page) || +page <= 0)
        throw new HttpException(
          'must be a non negative number',
          HttpStatus.BAD_REQUEST,
        );
      value.page = +page;
    }

    //If user has included a query string and it has 'results'
    if (Object.keys(value).includes('results')) {
      const results = value.results;

      //Checking to see if page is a number and is valid
      if (isNaN(results) || +results <= 0)
        throw new HttpException(
          'must be a non negative number',
          HttpStatus.BAD_REQUEST,
        );
      value.results = +results;
    }

    return { ...value };
  }
}
