import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Setting } from "./entities/setting.entity";

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(Setting)
    private readonly settingRepository: Repository<Setting>
  ) {}

  async findAll() {
    try {
      var settings = await this.settingRepository.find();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!settings) {
      throw new NotFoundException();
    }
    return settings;
  }

  async findOne(id: number) {
    try {
      var setting = await this.settingRepository.findOne(id);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    if (!setting) {
      throw new NotFoundException();
    }
    return setting;
  }

  async update(id: number, value: number) {
    const setting = await this.findOne(id);
    setting.value = value;
    try {
      this.settingRepository.save(setting);
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
    return setting;
  }

  async restoreDefault() {
    try {
      await this.settingRepository
        .createQueryBuilder()
        .update()
        .set({ value: () => "default_value" })
        .execute();
    } catch (e) {
      throw new InternalServerErrorException(e.message);
    }
  }
}
