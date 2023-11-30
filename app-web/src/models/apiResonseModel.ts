export enum ResultCode {
  FailMsg = -2,
  Fail = -1,
  Success = 0,
  Warning = 1,
  error404 = -11,
}

export class ResultModel<T> {
  public data: T;
  public result: number;
  public errorMessage: string;
  public friendlyMessage: string | undefined | null = null;

  public constructor(init?: Partial<ResultModel<T>>) {
    Object.assign(this, init);
  }
}

export class GridDataSource<T> {
  public dataSource: T[];
  public extendData: any;
  public currentCount: number;
  public totalRows: number;
  public currentPage: number;
  public currentPageSize: number;
  public isLastPage: boolean;
}
