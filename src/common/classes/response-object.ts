import { HttpStatus } from "@nestjs/common";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseObject<T = undefined, Z = string> {
  constructor(statusCode: number, message: Z, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
  }
  @ApiProperty({ type: "integer", example: 500 })
  statusCode: number;
  @ApiProperty({ type: "string", example: "Internal Server Error" })
  message: Z;
  data?: T;
}

export class OkResponseObject<T> extends ResponseObject<T> {
  constructor(message: string, data?: T) {
    super(HttpStatus.OK, message, data);
  }
  /* otherwise can't override decorators */
  @ApiProperty({ type: "200", example: HttpStatus.OK })
  statusCode: HttpStatus.OK;
  @ApiProperty({ type: "string", example: "Ok" })
  message: string;
}

export class CreatedResponseObject<T> extends ResponseObject<T> {
  constructor(message: string, data?: T) {
    super(HttpStatus.CREATED, message, data);
  }
  /* otherwise can't override decorators */
  @ApiProperty({ type: "201", example: HttpStatus.CREATED })
  statusCode: HttpStatus.CREATED;
  @ApiProperty({ type: "string", example: "Created" })
  message: string;
}

export class InternalServerErrorResponseObject extends ResponseObject {
  constructor(message: string) {
    super(HttpStatus.INTERNAL_SERVER_ERROR, message);
  }
  @ApiProperty({ type: "500", example: HttpStatus.INTERNAL_SERVER_ERROR })
  statusCode: HttpStatus.INTERNAL_SERVER_ERROR;
  @ApiProperty({ type: "string", example: "Internal Server Error" })
  message: string;
}

export class BadRequestResponseObject extends ResponseObject<
  undefined,
  string[] /* The way class validator returns errors */
> {
  constructor(message: string[]) {
    super(HttpStatus.BAD_REQUEST, message);
  }
  @ApiProperty({ type: "400", example: HttpStatus.BAD_REQUEST })
  statusCode: HttpStatus.BAD_REQUEST;
  @ApiProperty({
    type: "array",
    example: ["foo must be a string", "bar must be a boolean value"],
    items: {
      type: "string",
    },
  })
  message: string[];
  @ApiProperty({ type: "Bad Request", example: "Bad Request" }) error: "Bad Request";
}

export class NotFoundResponseObject extends ResponseObject {
  constructor(message: string) {
    super(HttpStatus.NOT_FOUND, message);
  }
  @ApiProperty({ type: "404", example: HttpStatus.NOT_FOUND })
  statusCode: HttpStatus.NOT_FOUND;
  @ApiProperty({ type: "string", example: "Not Found" })
  message: string;
}
