export type SubmarineInformation = {
  server: string;
  numbering: number;
  name: string;
  departure_time: string;
  required_time: string;
  arrival_time: string;
};

export type RequestSQLParams = {
    request: string;
    params: string[];
}