import { Controller, Get, Post, Body, Patch, Param, HttpCode, HttpStatus, Delete, ParseIntPipe } from "@nestjs/common";
import { SettingsService } from "./settings.service";
import { UpdateSettingDto } from "./dto/update-setting.dto";
import { ClearNewsDto } from "./dto/clear-news.dto";
import {
  ApiBadRequestResponse,
  ApiExtraModels,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiTags,
  getSchemaPath,
} from "@nestjs/swagger";
import {
  BadRequestResponseObject,
  InternalServerErrorResponseObject,
  NotFoundResponseObject,
  OkResponseObject,
} from "src/utils/response-object";
import { Setting } from "./entities/setting.entity";

@ApiTags("settings")
@Controller("settings")
@ApiExtraModels(Setting)
@ApiInternalServerErrorResponse({
  description: "internal server error has occured",
  type: InternalServerErrorResponseObject,
})
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @ApiOkResponse({
    description: "settings have been successfully fetched",
    schema: {
      allOf: [
        { $ref: getSchemaPath(OkResponseObject) },
        {
          properties: {
            data: {
              type: "array",
              items: {
                $ref: getSchemaPath(Setting),
              },
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: "no settings found",
    type: NotFoundResponseObject,
  })
  @ApiOperation({ summary: "fetches all settings from database" })
  @Get()
  findAll() {}

  @ApiOkResponse({
    description: "setting has been successfully fetched",
    schema: {
      allOf: [
        { $ref: getSchemaPath(OkResponseObject) },
        {
          properties: {
            data: {
              $ref: getSchemaPath(Setting),
            },
          },
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: "setting with specified id does not exist",
    type: NotFoundResponseObject,
  })
  @ApiBadRequestResponse({
    description: "incorrect request parameter",
    type: BadRequestResponseObject,
  })
  @ApiOperation({ summary: "fetches specified setting from database" })
  @ApiParam({ name: "id", type: "integer" })
  @Get(":id")
  findOne(@Param("id", ParseIntPipe) _id: number) {}

  @Post("restore-default")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "restores default settings" })
  @ApiOkResponse({
    description: "settings have been successfuly restored to default",
    type: OkResponseObject,
  })
  async restoreDefault() {}

  @ApiOkResponse({
    description: "setting has been successfully changed",
    type: OkResponseObject,
  })
  @ApiBadRequestResponse({
    description: "incorrect request parameters",
    type: BadRequestResponseObject,
  })
  @Patch(":id")
  update(@Param("id", ParseIntPipe) id: number, @Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.update(id, updateSettingDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "updates news" })
  @ApiOkResponse({
    description: "news have been successfuly updated",
    type: OkResponseObject,
  })
  @Patch("update-news")
  updateNews() {}

  @ApiOkResponse({
    description: "news have been successfuly cleared",
    type: OkResponseObject,
  })
  @ApiOperation({ summary: "clears news" })
  @ApiBadRequestResponse({
    description: "incorrect request parameters",
    type: BadRequestResponseObject,
  })
  @Delete("clear-news")
  clearNews(@Body() _clearNewsDto: ClearNewsDto) {}
}
