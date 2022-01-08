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
  async findAll() {
    return await this.settingsService.findAll();
  }

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
    description: "no setting with given id found",
    type: BadRequestResponseObject,
  })
  @ApiOperation({ summary: "fetches specified setting from database" })
  @ApiParam({ name: "id", type: "integer" })
  @Get(":id")
  async findOne(@Param("id", ParseIntPipe) id: number) {
    return new OkResponseObject<Setting>("Ok", await this.settingsService.findOne(id));
  }

  @Post("restore-default")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "restores default settings" })
  @ApiOkResponse({
    description: "settings have been successfuly restored to default",
    type: OkResponseObject,
  })
  async restoreDefault() {
    await this.settingsService.restoreDefault();
    return new OkResponseObject("Successfully restored default settings");
  }

  @ApiOkResponse({
    description: "setting has been successfully changed",
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
  @ApiBadRequestResponse({
    description: "incorrect request parameters",
    type: BadRequestResponseObject,
  })
  @ApiOperation({ summary: "updates value of given setting" })
  @Patch(":id")
  async update(@Param("id", ParseIntPipe) id: number, @Body() { value }: UpdateSettingDto) {
    return new OkResponseObject<Setting>(
      "setting has been successfully changed",
      await this.settingsService.update(id, value)
    );
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
