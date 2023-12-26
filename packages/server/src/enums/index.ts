export enum ErrorType {
    ValidationError = "VALIDATION_ERROR",
    UnknownError = "UNKNOWN_ERROR",
    FileUploadError = "FILE_UPLOAD_ERROR",
    Authentication = "AUTHENTICATION_ERROR",
    NotFound = "NOT_FOUND",
    InternalServerError = "INTERNAL_SERVER_ERROR",
}

export enum HttpStatusCode {
    Ok = 200,
    Unauthorized = 401,
    NotFound = 404,
    Unprocessable = 422,
    BadRequest = 400,
    InternalServerError = 500,
    NotImplemented = 501,
    HttpVersionNotSupported = 505,
}

export enum ScreeningType {
    RealTime = 'REALTIME',
    Batching = 'BATCHING',
}

export enum EntityType {
    Business = 'Business',
    Individual = 'Individual',
}

export enum DateFormat {
  Input = 'DD/MM/YYYY',
  Output = 'YYYY-MM-DD'
}

export enum FiltersType {
    Match = 'Match',
    Entity = 'Entity',
    Alerts= 'Alerts'
}

export enum JobState {
    FileUploaded = 'file uploaded',
    ProcessingComplete = 'processing complete'
}

export enum Gender {
    Male = 'Male',
    Female = 'Female'
}

export enum JobStatus {
    InProgress = 'InProgress',
    Complete = 'Complete',
    Error = 'Error',
    Pending = 'Pending'
}
